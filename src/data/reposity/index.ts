
import { UserReposity } from './user.reposity'
import { WorkspaceReposity } from './workspace.reposity'

export interface IGlobalReposisies {
  users: UserReposity
  workspace: WorkspaceReposity
}

export const GlobalReposities: IGlobalReposisies = {
  users: null,
  workspace: null,
}

export const buildGlobalReposity = async () => {
  const userReposity = new UserReposity()
  const workspaceReposity = new WorkspaceReposity()

  GlobalReposities.users = userReposity
  GlobalReposities.workspace = workspaceReposity
}

export class Reposity {
  public static get users () {
    return GlobalReposities.users
  }

  public static get workspace () {
    return GlobalReposities.workspace
  }
} 

