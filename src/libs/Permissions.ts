import { TParticipantRole } from '~/data/database/models/projects/ParticipantModel'
import { TUserRole } from '~/entities/user/UserEntity'

export type TWorkspacePermissionType = 'add' | 'delete' | 'update' | 'edit' | 'read'
export type TUserPermissions = 'create' | 'update' | 'delete' | 'read' | 'read:hidden' | 'use'

export interface IWorkspacePermissions {
  role: TParticipantRole
  permissionsLevel: number
  participant: TWorkspacePermissionType[]
  space: TWorkspacePermissionType[]
  settings: TWorkspacePermissionType[]
}

export interface IUserPermissions {
  role: TUserRole
  permissionsLevel: number
  promocodes: TUserPermissions[]
}

const WORKSPACE_ROLES: IWorkspacePermissions[] = [
  {
    role: 'maintainer',
    permissionsLevel: 10,
    participant: ['add', 'delete', 'edit', 'read', 'update'],
    space: ['add', 'delete', 'edit', 'read', 'update'],
    settings: ['add', 'delete', 'edit', 'read', 'update'],
  },
  {
    role: 'admin',
    permissionsLevel: 3,
    participant: ['add', 'delete', 'edit', 'read', 'update'],
    space: ['add', 'edit', 'read', 'update'],
    settings: ['add', 'edit', 'read', 'update'],
  },
  {
    role: 'editor',
    permissionsLevel: 2,
    participant: ['read'],
    space: ['add', 'edit', 'read', 'update'],
    settings: [],
  },
  {
    role: 'guest',
    permissionsLevel: 1,
    participant: ['read'],
    space: ['read'],
    settings: [],
  },
]

const USER_ROLES: IUserPermissions[] = [
  {
    role: 'guest',
    permissionsLevel: 0,
    promocodes: ['read']
  },
  {
    role: 'user',
    permissionsLevel: 1,
    promocodes: ['use', 'read']
  },
  {
    role: 'manager',
    permissionsLevel: 2,
    promocodes: ['use', 'read', 'read:hidden', 'update']
  },
  {
    role: 'admin',
    permissionsLevel: 3,
    promocodes: ['use', 'read', 'read:hidden', 'update', 'create', 'delete']
  },
  {
    role: 'root',
    permissionsLevel: 10,
    promocodes: ['use', 'read', 'read:hidden', 'update', 'create', 'delete']
  }
]

export class ParticipantPermissions {
  constructor () {}

  public static get list () {
    return WORKSPACE_ROLES
  }

  public static getPermissions (role: TParticipantRole = 'guest'): IWorkspacePermissions {
    return WORKSPACE_ROLES.find((el) => el.role == role) || WORKSPACE_ROLES.find((el) => el.role == 'guest')
  }
}

export class UserPermissions {
  public static get list () {
    return USER_ROLES
  }

  public static getPermissions (role: TUserRole = 'guest'): IUserPermissions {
    return USER_ROLES.find((el) => el.role == role) || USER_ROLES[0]
  }
}
