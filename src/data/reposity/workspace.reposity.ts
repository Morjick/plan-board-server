
import { IUserLeaveEventBody, WorkspaceEntity } from '~/entities/projects/WorkspaceEntity'
import { Emitter } from '~/libs/Emitter'
import { LocationEntity } from '~/entities/user/LocationEntity'
import { UserEntity } from '~/entities/user/UserEntity'

export class WorkspaceReposity {
  private workspaces: WorkspaceEntity[] = []

  public emitter = new Emitter()

  constructor () {}

  public addWorkspace (workspace: WorkspaceEntity) {
    workspace.emitter.on('update:participant', (data: IUserLeaveEventBody) => {
      if (!data.online || !data.watchers.length) {
        this.workspaces = this.workspaces.filter((el) => el.hash == data.hash)
      }
    })

    workspace.emitter.on('update:no-participant', (workspace: WorkspaceEntity) => {
      this.workspaces = this.workspaces.filter((el) => el.hash == workspace.hash)
    })

    this.workspaces.push(workspace)
  }

  public disconnectUser (location: string, user: UserEntity) {
    const workspace = this.workspaces.find((el) => el.location == location)

    workspace.userLeave(user)
  }

  public async findWorkspace (location: LocationEntity) {
    const isWorkspace =  this.workspaces.find((el) => el.location == location.value)
    if (isWorkspace) return isWorkspace

    const workspace = new WorkspaceEntity()
    const response = await workspace.findByHash(location.hash)

    if (response.exception.type !== 'OK') return null

    this.addWorkspace(workspace)

    return workspace
  }
}
