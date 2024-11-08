
import { IEntity } from '../interfaces/docs.interfaces'

export const entities: IEntity[] = [
  {
    name: 'UserEntity',
    params: [
      { name: 'id', type: 'number', value: 'number' },
      { name: 'firstname', type: 'string', value: 'string' },
      { name: 'middlename', type: 'string', value: 'string' },
      { name: 'lastname', type: 'string', value: 'string' },
      { name: 'email', type: 'string', value: 'string' },
      { name: 'phone', type: 'string', value: 'string' },
      { name: 'avatar', type: 'string', value: 'string' },
      { name: 'hash', type: 'string', value: 'string' },
      { name: 'tariff', type: 'TariffEntity', value: 'TariffEntity' },
      { name: 'location', type: 'string', value: 'string' },
    ]
  },
  {
    name: 'TariffEntity',
    params: [
      { name: 'name', type: 'string', value: 'string' },
      { name: 'type', type: 'TTariffType', value: 'TTariffType' },
      { name: 'description', type: 'string', value: 'number' },
      { name: 'price', type: 'number', value: 'number' },
      { name: 'limits', type: 'TariffLimitEntity', value: 'TariffLimitEntity' },
    ]
  },
  {
    name: 'TariffLimitEntity',
    params: [
      { name: 'projectsCount', type: 'number', value: 'number | \'unlimited\'' },
      { name: 'commandLength', type: 'number', value: 'number | \'unlimited\'' },
    ]
  },
  {
    name: 'IUserProfile',
    params: [
      { name: 'firstname', type: 'string', value: 'string' },
      { name: 'middlename', type: 'string', value: 'string' },
      { name: 'lastname', type: 'string', value: 'string' },
      { name: 'avatar', type: 'string', value: 'string' },
      { name: 'hash', type: 'string', value: 'string' },
    ]
  },
  {
    name: 'IUserFullProfile',
    params: [
      { name: 'firstname', type: 'string', value: 'string' },
      { name: 'middlename', type: 'string', value: 'string' },
      { name: 'lastname', type: 'string', value: 'string' },
      { name: 'avatar', type: 'string', value: 'string' },
      { name: 'hash', type: 'string', value: 'string' },
      { name: 'email', type: 'string', value: 'string' },
      { name: 'phone', type: 'string', value: 'string' },
    ]
  },
  {
    name: 'LocationEntity',
    params: [
      { name: 'location', type: 'string', value: 'string' },
      { name: 'hash', type: 'string', value: 'string' },
      { name: 'value', type: 'string', value: 'string' },
    ]
  },
  {
    name: 'ParticipantEntity',
    params: [
      { name: 'id', type: 'number', value: 'number' },
      { name: 'userHash', type: 'string', value: 'string' },
      { name: 'role', type: 'TParticipantRole', value: 'TParticipantRole' },
      { name: 'isAnonyme', type: 'boolean', value: 'boolean' },
      { name: 'user', type: 'UserEntity', value: 'UserEntity' },
    ]
  },
  {
    name: 'IWorkspacePermissions',
    params: [
      { name: 'role', type: 'TParticipantRole', value: 'TParticipantRole' },
      { name: 'permissionsLevel', type: 'number', value: 'number' },
      { name: 'participant', type: 'TWorkspacePermissionType', value: 'TWorkspacePermissionType[]' },
      { name: 'space', type: 'TWorkspacePermissionType', value: 'TWorkspacePermissionType[]' },
      { name: 'settings', type: 'TWorkspacePermissionType', value: 'TWorkspacePermissionType[]' },
    ]
  },
  {
    name: 'WorkspaceEntity',
    params: [
      { name: 'id', type: 'number', value: 'number' },
      { name: 'name', type: 'string', value: 'string' },
      { name: 'hash', type: 'string', value: 'string' },
      { name: 'created', type: 'string', value: 'string' },
      { name: 'lastUpdate', type: 'string', value: 'string' },
      { name: 'avatar', type: 'string', value: 'string' },
      { name: 'autorID', type: 'number', value: 'number' },
      { name: 'participantsID', type: 'number', value: 'number[]' },
      { name: 'location', type: 'string', value: 'string' },
      { name: 'online', type: 'number', value: 'number' },
      { name: 'watchers', type: 'IUserProfile', value: 'IUserProfile' },
      { name: 'settings', type: 'IWorkspaceSettings', value: 'IWorkspaceSettings' },
      { name: 'lastUpdated', type: 'string', value: 'string' },
    ]
  },
  {
    name: 'IWorkspaceSettings',
    params: [
      { name: 'showCursors', type: 'boolean', value: 'boolean' },
      { name: 'showNameOnCursor', type: 'boolean', value: 'boolean' },
      { name: 'isCanJoinAnonyme', type: 'boolean', value: 'boolean' },
      { name: 'autoAcceptUsers', type: 'boolean', value: 'boolean' },
    ]
  },
  {
    name: 'UserNotificationEntity',
    params: [
      { name: 'id', type: 'number', value: 'number' },
      { name: 'message', type: 'string', value: 'string' },
      { name: 'viewed', type: 'boolean', value: 'boolean' },
      { name: 'date', type: 'string', value: 'string' },
      { name: 'userID', type: 'number', value: 'number' },
    ]
  },
  {
    name: 'IDirectory',
    params: [
      { name: 'id', type: 'number', value: 'number' },
      { name: 'hash', type: 'string', value: 'string' },
      { name: 'name', type: 'string', value: 'string' },
      { name: 'lastUpdated', type: 'string', value: 'string' },
      { name: 'isPrivate', type: 'boolean', value: 'boolean' },
      { name: 'filesID', type: 'number', value: 'number[]' },
      { name: 'parrentID', type: 'number', value: 'number' },
      { name: 'autorHash', type: 'string', value: 'string' },
      { name: 'autor', type: 'IUserProfile', value: 'IUserProfile' },
    ]
  },
  {
    name: 'IDirectoryFile',
    params: [
      { name: 'id', type: 'number', value: 'number' },
      { name: 'path', type: 'string', value: 'string' },
      { name: 'name', type: 'string', value: 'string' },
      { name: 'slug', type: 'string', value: 'string' },
      { name: 'lastUpdated', type: 'string', value: 'string' },
      { name: 'type', type: 'TFileType', value: 'TFileType' },
      { name: 'parrentID', type: 'number', value: 'number' },
      { name: 'autorHash', type: 'string', value: 'string' },
      { name: 'autor', type: 'IUserProfile', value: 'IUserProfile' },
    ]
  },
]
