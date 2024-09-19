
import { ISocketNameSpace } from '~/data/interfaces/docs.interfaces'

export const workspaceNameSpace: ISocketNameSpace ={
  id: 'workspace',
  name: '/workspace/:workspaceHash',
  description: 'Подключиться к рабочей области',
  evetns: [
    {
      name: 'error:connection',
      description: 'При подключении произошла необработанная ошибка',
      body: [
        { name: 'message', type: 'string', value: 'string' },
      ]
    },
    {
      name: 'redirect',
      description: 'При подключении произошла необработанная ошибка',
      body: [
        { name: 'location', type: 'LocationEntity', value: 'LocationEntity' },
      ]
    },
    {
      name: 'error:permissions',
      description: 'В доступе к какому-либо действию отказано',
      body: [
        { name: 'message', type: 'string', value: 'string' },
        { name: 'workspace', type: 'string', value: 'string' },
        { name: 'permission', type: 'string', value: 'string' },
      ]
    },
    {
      name: 'waiting-invition',
      description: 'Пользователь ожидает одобрения на подключение к рабочей области',
      body: [
        { name: 'user', type: 'IUserProfile', value: 'IUserProfile' },
        { name: 'waiting', type: 'boolean', value: 'boolean' },
      ]
    },
    {
      name: 'update:participant',
      description: 'Список участников обновлён',
      body: [
        { name: 'online', type: 'number', value: 'number' },
        { name: 'watchers', type: 'IUserProfile', value: 'IUserProfile[]' },
        { name: 'leaver?', type: 'IUserProfile', value: 'IUserProfile' },
        { name: 'hash', type: 'string', value: 'string' },
      ]
    },
  ],
  actions: [
    {
      message: 'update-workspace',
      description: 'Изменить рабочую область (отправлять только тот параметр, который изменился)',
      params: [
        { name: 'name', type: 'string', value: 'string' },
        { name: 'avatar', type: 'string', value: 'string' },
        { name: 'showCursors', type: 'boolean', value: 'boolean', },
        { name: 'showNameOnCursor', type: 'boolean', value: 'boolean' },
        { name: 'isCanJoinAnonyme', type: 'boolean', value: 'boolean' },
        { name: 'autoAcceptUsers', type: 'boolean', value: 'boolean' },
      ]
    },
    {
      message: 'add-to-favorite',
      description: 'Добавить или удалить рабочую область из избранного',
      params: []
    },
  ],
}
