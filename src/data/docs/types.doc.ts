import { IUnionType } from '../interfaces/docs.interfaces'

export const unionTypes: IUnionType[] = [
  {
    name: 'TWorkspacePermissionType',
    values: ['add', 'delete', 'update', 'edit', 'read']
  },
  {
    name: 'TParticipantRole',
    values: ['guest', 'editor', 'maintainer', 'admin']
  },
  {
    name: 'TLocation',
    values: ['room', 'directory', 'workspace', 'workspace:waiting', 'workspace:error', 'workspace:loading']
  },
  {
    name: 'TTariffType',
    values: ['basic', 'advanced', 'pro']
  },
  {
    name: 'TFigureType',
    values: ['straight-line', 'square', 'circle']
  },
  {
    name: 'THelpPage',
    values: ['directories', 'workspace']
  },
  {
    name: 'TFileType',
    values: ['workspace',  'txt',  'doc',  'docx',  'pdf',  'xsls',  'xls',  'directory']
  }
]
