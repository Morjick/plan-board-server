import { TParticipantRole } from '~/data/database/models/projects/ParticipantModel'

export type TWorkspacePermissionType = 'add' | 'delete' | 'update' | 'edit' | 'read'

export interface IWorkspacePermissions {
  role: TParticipantRole
  permissionsLevel: number
  participant: TWorkspacePermissionType[]
  space: TWorkspacePermissionType[]
  settings: TWorkspacePermissionType[]
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

export class ParticipantPermissions {
  constructor () {}

  public static get list () {
    return WORKSPACE_ROLES
  }

  public static getPermissions (role: TParticipantRole) {
    return WORKSPACE_ROLES.find((el) => el.role == role) || WORKSPACE_ROLES.find((el) => el.role == 'guest')
  }
}
