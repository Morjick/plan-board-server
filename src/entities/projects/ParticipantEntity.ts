
import { createReponse, DeletedResponse, NotFoundResponse, OKResponse, PermissionDeniedResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { IWorkspacePermissions, ParticipantPermissions } from '~/libs/Permissions'
import { Participants, TParticipantRole } from '~/data/database/models/projects/ParticipantModel'
import { Emitter } from '~/libs/Emitter'
import { IResponse } from '~/data/interfaces/server.interfaces'
import { Reposity } from '~/data/reposity'

interface ICreateParticipant {
  userHash: string
  role: TParticipantRole
}

export class ParticipantEntity {
  id: number
  userHash: string
  role: TParticipantRole
  isAnonyme: boolean = false

  emitter = new Emitter()

  public get permissions (): IWorkspacePermissions {
    return ParticipantPermissions.getPermissions(this.role)
  }

  public get user () {
    return Reposity.users.findOnlineUser(this.userHash)
  }

  public get isOnline () {
    return !!Reposity.users.findOnlineUser(this.userHash)
  }

  constructor () {}

  public async findByID (id: number) {
    try {
      const participantModel = await Participants.findByPk(id)
      if (!participantModel) return NotFoundResponse

      const participant = participantModel.dataValues

      this.id = participant.id
      this.userHash = participant.userHash
      this.role = participant.role
    } catch {
      return ServerErrorResponse
    }
  }

  public async getUser () {
    return await Reposity.users.findUser(this.userHash)
  }

  public async updateRole (role: TParticipantRole, participant: ParticipantEntity): Promise<IResponse> {
    try {
      if (role == 'maintainer') return createReponse(PermissionDeniedResponse, {}, {
        type: 'warning',
        message: 'Невозможно установить эту роль'
      })

      if (this.role == 'maintainer') return createReponse(PermissionDeniedResponse, {}, {
        type: 'warning',
        message: 'Основателю рабочей области нельзя изменять роль'
      })

      const isHaveUpdatePermissions = participant.permissions.participant.includes('update')
      const isMoreRoleLevel = this.permissions.permissionsLevel >= participant.permissions.permissionsLevel

      if (!isHaveUpdatePermissions || isMoreRoleLevel) return createReponse(PermissionDeniedResponse, {}, {
        type: 'warning',
        message: 'У вас нет доступа для изменения роли этому участнику'
      })

      await Participants.update({ role: role }, { where: { id: this.id } })
      this.role = role

      this.emitter.emit('update', this)
      return createReponse(OKResponse, { message: 'Роль изменена' })
    } catch {
      return ServerErrorResponse
    }
  }

  public static async create (data: ICreateParticipant) {
    try {
      const user = await Reposity.users.findUser(data.userHash)
      if (!user) return createReponse(NotFoundResponse, { message: 'Пользователь не найден' })

      const participant = await Participants.create({ ...data })

      return createReponse(OKResponse, {
        participant: participant.dataValues
      })
    } catch (e) {
      return createReponse(ServerErrorResponse, {
        error: new Error(e).message
      })
    }
  }

  public static async delete (id: number): Promise<IResponse> {
    try {
      await Participants.destroy({ where: { id } })

      return DeletedResponse
    } catch {
      return ServerErrorResponse
    }
  }
}
