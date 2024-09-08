
import {
  AlreadyExistResponse, 
  NotFoundResponse,
  OKResponse,
  ServerErrorResponse,
} from '../../data/constants/Responses'
import { ChangePasswordContract, CreateUserContract, LoginUserContract, UpdateProfileContract, } from '~/data/contracts/user.contract'
import { ILocationConstructor, LocationEntity } from './LocationEntity'
import { ITariffitem, TariffEntity, TTariffType } from '../tariff/TariffEntity'
import { Emitter } from '~/libs/Emitter'
import { IResponse } from '~/data/interfaces/server.interfaces'
import { Libs } from '~/libs/Libs'
import { ParticipantEntity } from '../projects/ParticipantEntity'
import { Projects } from '~/data/database/models/projects/ProjectModel'
import { Security } from '../../libs/Security'
import { Socket } from 'socket.io'
import { UserNotificationEntity } from './UserNotification'
import { Users } from '../../data/database/models/user/UserModel'
import { WorkspaceEntity } from '../projects/WorkspaceEntity'

export type TNotifyEvent = 'redirect' | 'error:permissions' | 'workspace:update' | 'workspace:edit' | 'error:connection' | 'waiting-invition' | 'notification'

interface ICreateUserData {
  firstname: string
  middlename?: string
  lastname?: string
  email: string
  phone?: string
  avatar?: string
  hash: string
  password: string
  tariffType: TTariffType
}

export interface IUserProfile {
  id: number
  firstname: string
  middlename: string
  lastname: string
  avatar: string
  hash: string
  fullname: string
}

export interface IUserFullProfile extends IUserProfile {
  email: string
  phone: string
}

export interface ICreateNotification {
  message: string
  href?: string
}

export class UserEntity {
  public id: number
  public firstname: string
  public middlename: string
  public lastname: string
  public avatar: string
  public hash: string
  public projectsCount: number = 0
  public projectsHash: string[] = []
  public online: boolean = false

  private email: string
  private phone: string
  private password: string
  private tariffType: TTariffType = 'basic'

  public notifications: UserNotificationEntity[] = []
  public workspaces: WorkspaceEntity[] = []

  public emitter = new Emitter()
  public socket: Socket
  private locationEntity: LocationEntity = new LocationEntity()

  public get location(): string {
    return this.locationEntity.value
  }

  public get fullLocation (): LocationEntity {
    return this.locationEntity
  }

  public get tariff () {
    return TariffEntity.getTariff(this.tariffType)
  }

  public get profile (): IUserProfile {
    return {
      id: this.id,
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      avatar: this.avatar,
      hash: this.hash,
      fullname: this.fullname,
    }
  }

  public get fullProfile (): IUserFullProfile {
    return {
      ...this.profile,
      id: this.id,
      email: this.email,
      phone: this.phone,
      fullname: this.fullname,
    }
  }

  public get fullname () {
    const names = [this.lastname, this.firstname, this.middlename]
    return names.join(' ')
  }

  constructor () {
    this.hash = Libs.randomString(16)
  }

  public async findByID (id: number): Promise<IResponse> {
    const result = await Users.findByPk(id)
    const user = result?.dataValues

    if (!user) return NotFoundResponse

    this.id = user.id
    this.firstname = user.firstname
    this.middlename = user.middlename
    this.lastname = user.lastname
    this.avatar = user.avatar
    this.hash = user.hash
    this.tariffType = user.tariffType
    this.email = user.email
    this.password = user.password
    this.projectsHash = user.projectsHash

    this.phone = Security.decode(user.phone)

    const projects = await Projects.findAll({ where: { autorID: this.id } })
    this.projectsCount = projects.length

    this.notifications = await UserNotificationEntity.findAll(this.id)

    return {
      status: 200,
      exception: {
        type: 'OK',
        message: 'Пользователь найден'
      },
      body: {
        tariff: this.tariff,
      }
    }
  }

  public async findByHash (hash: string) {
    const user = await Users.findOne({ where: { hash } })
    if (!user) return NotFoundResponse

    const userID = user.dataValues.id
    return await this.findByID(userID)
  }

  public async disconnect () {
    this.online = false
    this.emitter.emit('disconnect', this)
  }

  public async changeTariff (tariff: ITariffitem): Promise<IResponse> {
    this.tariffType = tariff.type
    
    return {
      status: 200,
      exception: { type: 'Updated', message: 'Тариф изменён' },
      body: { tarif: this.tariff },
    }
  }

  public async changePassword (data: ChangePasswordContract): Promise<IResponse> {
    try {
      const { currentPassword, newPassword } = data
      const isComparedPassword = await Security.comparePassword(currentPassword, this.password)

      if (isComparedPassword.exception.type !== 'OK') return {
        status: 401,
        exception: { type: 'Unauthorized', message: 'Введён не верный пароль' }
      }

      const password = Security.encode(newPassword)

      Users.update({ password }, { where: { id: this.id } })
      this.password = password

      return OKResponse
    } catch (e) {
      const message = new Error(e).message
      return { ...ServerErrorResponse, body: { error: message } }
    }
  }

  public async updateProfile (data: UpdateProfileContract): Promise<IResponse> {
    try {
      for (const property in data) {
        this[property] = data[property]
      }
  
      await Users.update({ ...data }, { where: { id: this.id } })
  
      this.emitter.emit('update', this)

      return {
        status: 200,
        exception: { type: 'OK', message: 'Профиль обновлён' }
      }
    } catch {
      return ServerErrorResponse
    }
  }

  public async createNotification (data: ICreateNotification) {
    const response = await UserNotificationEntity.create({ message: data.message, userID: this.id })

    if (response.exception.type !== 'OK') return response

    const notification = response.body.notification
    this.notifications.push(notification)

    if (this.online) {
      this.notify('notification', {
        notification: notification,
      })
    }

    return OKResponse
  }

  public inviteToWorkspace (workspace: WorkspaceEntity, inviter: ParticipantEntity) {
    const message = `${inviter.user.fullname} пригласил вас в рабочую область ${workspace.name}`
    const href = workspace.hash

    return this.createNotification({ message, href, })
  }

  public acceptInvition (workspace: WorkspaceEntity) {
    this.projectsHash.push(workspace.hash)

    Users.update({ projectsHash: this.projectsHash }, { where: { id: this.id } })
  }

  public async getWorkspaces () {
    return await WorkspaceEntity.findProjectModels(this.projectsHash)
  }

  public notify <NotifyBody = any>(event: TNotifyEvent, body: NotifyBody) {
    if (!this.socket) return

    this.socket.emit(event, JSON.stringify(body))
  }

  public set location (data: ILocationConstructor) {
    this.locationEntity.hash = data.hash
    this.locationEntity.location = data.location

    this.emitter.emit('update:location', this.location)
  }

  public static async registration (data: CreateUserContract): Promise<IResponse> {
    try {
      const isPaswordValid = await Libs.checkValidPassword(data.password, data.firstname)

      if (!isPaswordValid.ok) return {
        status: 400,
        exception: {
          type: 'InvalidRequest',
          message: isPaswordValid.message,
        },
      }

      const isUserExists = await Users.findOne({ where: { email: data.email }, attributes: ['id'] })

      if (isUserExists) return AlreadyExistResponse

      const hash = Libs.randomString(15)
      const password = Security.encode(data.password)

      const userData: ICreateUserData = {
        firstname: data.firstname,
        middlename: data.middlename,
        lastname: data.lastname,
        hash,
        password,
        email: data.email,
        tariffType: 'basic',
      }

      const user = await Users.create({ ...userData })

      const hashedData = { hash, firstname: data.firstname, password }
      const [accessToken, refreshToken] = await Security.getAuthToken(hashedData)

      return {
        status: 201,
        exception: {
          type: 'OK',
          message: 'Пользователь успешно создан'
        },
        body: {
          accessToken, refreshToken,
          user: { id: user.id },
        }
      }
    } catch {
      return ServerErrorResponse
    }
  }

  public static async login (data: LoginUserContract): Promise<IResponse> {
    try {
      const candidat = await Users.findOne({ where: { email: data.email }, attributes: ['id', 'password', 'hash', 'firstname'] })

      if (!candidat) return NotFoundResponse
      const user = candidat.dataValues

      const isPassword = await Security.comparePassword(data.password, user.password)

      if (isPassword.exception.type !== 'OK') return isPassword

      const hashedData = { hash: user.hash, firstname: user.firstname, password: user.password }
      const [accessToken, refreshToken] = await Security.getAuthToken(hashedData)

      return {
        status: 200,
        exception: {
          type: 'OK',
          message: 'Пользователь авторизан'
        },
        body: { accessToken, refreshToken }
      }
    } catch {
      return ServerErrorResponse
    }
  }

  public static async checkToken (token: string): Promise<IResponse> {
    try {
      return Security.checkToken(token)
    } catch {
      return ServerErrorResponse
    }
  }

  public static async updateToken (token: string): Promise<IResponse> {
    return Security.updateToken(token)
  }

  public static async deleteUser (userHash: string): Promise<IResponse> {
    try {
      const userData = await Users.findOne({ where: { hash: userHash } })

      if (!userData) return NotFoundResponse

      await Users.destroy({ where: { hash: userHash } })

      return OKResponse
    } catch {
      return ServerErrorResponse
    }
  }
}
