
import { createReponse, NotFoundResponse, OKResponse, PermissionDeniedResponse, ServerErrorResponse, UnauthorizedResponse } from '~/data/constants/Responses'
import { ILocationConstructor, LocationEntity } from '../user/LocationEntity'
import { IProjectModel, Projects } from '~/data/database/models/projects/ProjectModel'
import { IUserProfile, UserEntity } from '../user/UserEntity'
import { Participants, TParticipantRole } from '~/data/database/models/projects/ParticipantModel'
import { CreateWorkspaceContract } from '~/data/contracts/projects.contracts'
import { Directories } from '~/data/database/models/projects/DirectoryModel'
import { Emitter } from '~/libs/Emitter'
import { IResponse } from '~/data/interfaces/server.interfaces'
import { Libs } from '~/libs/Libs'
import { Op } from 'sequelize'
import { ParticipantEntity } from './ParticipantEntity'
import { Reposity } from '~/data/reposity'
import { SpaceEntity } from './SpaceEntity'
import { Spaces } from '~/data/database/models/projects/SpaceModel'

export interface IUserLeaveEventBody {
  online: number
  watchers: UserEntity[]
  leaver: UserEntity
  hash: string
}

export interface IUpdateWorkspace {
  name?: string
  avatar?: string
  showCursors?: boolean
  showNameOnCursor?: boolean
  isCanJoinAnonyme?: boolean
  autoAcceptUsers?: boolean
}

type TWorkspaceEmits = 'update:participant' | 'update:workspace' | 'delete' | 'update:no-participant'

export class WorkspaceEntity {
  public id: number
  public name: string
  public hash: string
  public created: string
  public lastUpdate: string
  public avatar: string
  public autorID: number
  public participantsID: number[] = []
  public parantID: number

  public space: SpaceEntity
  public emitter = new Emitter<TWorkspaceEmits>()
  private locationEntity: LocationEntity = null

  public get location (): string {
    return this.locationEntity.value
  }

  // participants
  public participatsList: ParticipantEntity[] = []
  public onlineParticipant: ParticipantEntity[] = []

  // settings
  private showCursors: boolean = false
  private showNameOnCursor: boolean = false
  private isCanJoinAnonyme: boolean = false
  private autoAcceptUsers: boolean = false

  public get settings () {
    return {
      showCursors: this.showCursors,
      showNameOnCursor: this.showNameOnCursor,
      isCanJoinAnonyme: this.isCanJoinAnonyme,
      autoAcceptUsers: this.autoAcceptUsers,
    }
  }

  // users
  private get watcherList (): UserEntity[] {
    return Reposity.users.userInLocation(this.location)
  }

  public get watchers (): IUserProfile[] {
    return this.watcherList.map((el) => el.profile)
  }

  public get online () {
    return this.watcherList.length
  }

  constructor () {}

  public async findById (id: number) {
    try {
      const workspaceData = await Projects.findByPk(id)
      if (!workspaceData) return NotFoundResponse

      await this.setData(workspaceData.dataValues)

      return createReponse(OKResponse, {
        location: this.location
      })
    } catch (e) {
      createReponse(ServerErrorResponse, { message: new Error(e).message })
    }
  }

  public async findByHash (hash: string) {
    try {
      const workspaceData = await Projects.findOne({ where: { hash, } })
      if (!workspaceData) return NotFoundResponse

      await this.setData(workspaceData.dataValues)

      return createReponse(OKResponse, {
        location: this.location
      })
    } catch (e) {
      createReponse(ServerErrorResponse, { message: new Error(e).message })
    }
  }

  public findParticipant (hash: string) {
    return this.participatsList.find((el) => el.userHash == hash)
  }

  public async update (data: IUpdateWorkspace, participant: ParticipantEntity) {
    try {
      const user = await participant.getUser()
      const isHavePermission = participant.permissions.space.includes('update')
  
      if (!isHavePermission) {
        user.notify('error:permissions', {
          message: 'У вас нет доступа для изменения рабочей области',
          workspace: this.hash,
          permission: 'space:update'
        })
        return
      }
  
      for (const property in data) {
        if (typeof data[property] == 'string' && !data[property].length) return

        if (this[property] == undefined || this[property] == null) return

        this[property] = data[property]
      }
  
      await Projects.update({
        name: this.name,
        avatar: this.avatar,
        showCursors: this.showCursors,
        showNameOnCursor: this.showNameOnCursor,
        isCanJoinAnonyme: this.isCanJoinAnonyme,
        autoAcceptUsers: this.autoAcceptUsers,
      }, { where: { id: this.id } })

      this.emitter.emit('update:workspace', this)
      this.participatsList.forEach((participant) => {
        participant.user.notify('workspace:update', {
          name: this.name,
          avatar: this.avatar,
          settings: this.settings,
        })
      })
    } catch (e) {
      return ServerErrorResponse
    }
  }

  public userLeave (user: UserEntity) {
    this.onlineParticipant = this.onlineParticipant.filter((el) => el.userHash !== user.hash)

    this.emitter.emit('update:participant', {
      online: this.online,
      watchers: this.watchers,
      leaver: user.profile,
      hash: this.hash,
    })

    if (!this.onlineParticipant.length) {
      this.emitter.emit('update:no-participant', this)
    }
  }

  public join (user: UserEntity, anonyme: boolean = false) {
    if (anonyme && !this.isCanJoinAnonyme) {
      user.notify('error:connection', { message: 'Для входа в эту комнату необходимо авторизоваться' })
      return
    }

    if (this.participantsID.includes(user.id)) {
      const participat = this.participatsList.find((el) => el.userHash == user.hash)
      return this.joinParticipant(participat)
    }

    const participant = new ParticipantEntity()

    participant.id = Libs.randomNumber(12000, 15000)
    participant.role = 'guest'

    if (this.autoAcceptUsers) {
      this.joinParticipant(participant)
    } else {
      user.notify('redirect', { location: new LocationEntity({
        location: 'workspace:waiting', hash: this.hash })
      })

      this.participatsList.forEach((participant) => {
        if (participant.permissions.participant.includes('add')) {
          participant.user.notify('waiting-invition', {
            user: user.profile,
            waiting: true
          })
        }
      })
    }
  }

  public acceptParticipant (participant: ParticipantEntity, admin: ParticipantEntity, isAccept: boolean = true) {
    if (!admin.permissions.participant.includes('add') || !admin.permissions.participant.includes('delete')) {
      return admin.user.notify('error:permissions', { message: 'У вас нет доступа для добавления участников в проект' })
    }

    if (!isAccept) {
      participant.user.notify('redirect', {
        location: new LocationEntity({ location: 'workspace:error', hash: this.hash })
      })

      return this.joinParticipant(participant, false)
    }

    this.joinParticipant(participant)
  }

  public async invite (user: UserEntity, inviter: ParticipantEntity, role: TParticipantRole = 'guest') {
    const isHavePermission = inviter.permissions.participant.includes('add')
    if (!isHavePermission) return inviter.user.notify('error:permissions', { message: 'У вас нет доступа для добавления участников в проект' })

    const response = await ParticipantEntity.create({ userHash: user.hash, role, })
    if (response.exception.type !== 'OK') return

    this.participantsID = response.body.participant.id
    
    const participant = new ParticipantEntity()
    await participant.findByID(response.body.participant.id)
    this.participatsList.push(participant)

    user.inviteToWorkspace(this, inviter)
  }

  private joinParticipant (participant: ParticipantEntity, accepted: boolean = true) {
    this.onlineParticipant.forEach((el) => {
      el.user.notify('waiting-invition', {
        user: participant.user.profile,
        waiting: false
      })
    })

    if (!accepted) return

    this.onlineParticipant.push(participant)

    participant.user.location = { location: 'workspace', hash: this.hash }
    participant.user.notify('redirect', {
      location: new LocationEntity({ location: 'workspace', hash: this.hash })
    })

    participant.user.notify('workspace:edit', {
      space: this.space.value,
    })

    this.emitter.emit('update:participant', this)
  }

  private async setData (data: IProjectModel) {
    try {
      const workspace = data
      this.id = workspace.id
      this.name = workspace.name
      this.hash = workspace.hash
      this.created = workspace.created
      this.lastUpdate = workspace.lastUpdate
      this.avatar = workspace.avatar
      this.autorID = workspace.autorID
      this.participantsID = workspace.participantsID || []
      this.showCursors = workspace.showCursors || false
      this.showNameOnCursor = workspace.showNameOnCursor || false
      this.isCanJoinAnonyme = workspace.isCanJoinAnonyme || false
      this.parantID = workspace.parantID
  
      this.locationEntity = new LocationEntity({ location: 'workspace', hash: this.hash })
  
      const participants = []
      await Promise.all(
        this.participantsID.map(async (participantID) => {
          const participant = new ParticipantEntity()
          await participant.findByID(participantID)
          if (!participant) return
  
          participants.push(participant)
        })
      )
  
      this.participatsList = participants
  
      const spaceData = await Spaces.findOne({ where: { workspaceID: this.id } })
  
      if (!spaceData) {
        const result = await Spaces.create({ workspaceID: this.id, hash: Libs.randomString(24) })
        this.space = new SpaceEntity(result.dataValues)
        return
      }
  
      this.space = new SpaceEntity(spaceData.dataValues)
    } catch (e) {
      console.log('error on find workspace: ', e)
    }
  }

  public set location (data: ILocationConstructor) {
    this.locationEntity.hash = data.hash
    this.locationEntity.location = data.location
  }

  public async delete (participant: ParticipantEntity): Promise<IResponse> {
    try {
      const isCanDelete = participant.permissions.settings.includes('delete')
      if (!isCanDelete) return createReponse(PermissionDeniedResponse, {
        message: 'Удалить рабочую область может только её создатель'
      })
  
      await Projects.destroy({ where: { id: this.id } })
  
      this.emitter.emit('delete', this)
      this.watcherList.forEach((user) => {
        user.notify('redirect', {
          location: new LocationEntity({ location: 'directory', hash: user.hash })
        })
      })

      return OKResponse
    } catch {
      return ServerErrorResponse
    }
  }

  public static async create (autor: UserEntity, data?: CreateWorkspaceContract): Promise<IResponse> {
    try {
      if (!autor) return createReponse(UnauthorizedResponse)
      const name = `Пространство #${Libs.randomString(16)}`
      const hash = Libs.randomString(16)

      const isUnlimited = autor.tariff.limits.projectsCount == 'unlimited'
      const isOverlimit = typeof autor.tariff.limits.projectsCount == 'number' && autor.projectsCount >= autor.tariff.limits.projectsCount

      if (!isUnlimited && isOverlimit) return createReponse(PermissionDeniedResponse, {
        message: 'Для того, чтобы создавать больше рабочих областей, вам необходимо сменить тариф'
      })

      const maintainer = await Participants.create({ userHash: autor.hash, role: 'maintainer' })

      let parantID = null

      if (data.directoryID) {
        const directory = await Directories.findByPk(data.directoryID)

        if (directory.autorHash !== autor.hash) return createReponse(PermissionDeniedResponse, {
          message: 'Вы не можете создавать файлы в этой директории'
        })

        parantID = directory.id
      }

      const workspace = await Projects.create({
        name, hash, participantsID: [maintainer.dataValues.id], autorID: autor.id,
        created: new Date().toLocaleString('ru'),
        lastUpdate: new Date().toLocaleString('ru'),
        showCursors: false, showNameOnCursor: false, isCanJoinAnonyme: false,
        parantID: parantID,
      })
      
      await Spaces.create({ workspaceID: workspace.dataValues.id, hash: Libs.randomString(24) })

      return createReponse(OKResponse, {
        workspace: workspace.dataValues,
      })
    } catch (e) {
      return createReponse(ServerErrorResponse, {
        error: new Error(e).message
      })
    }
  }

  public static async findProjectModels (hashs: string[]): Promise<IProjectModel[]> {
    const request = []

    hashs.forEach((hash) => {
      request.push({ hash })
    })

    const projects = await Projects.findAll({ where: {
      [Op.or]: request
    }})

    return projects.map((el) => el.dataValues)
  }
}
