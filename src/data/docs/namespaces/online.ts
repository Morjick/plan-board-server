
import { ISocketNameSpace } from '~/data/interfaces/docs.interfaces'

export const onlineNameSpace: ISocketNameSpace = {
  id: 'online',
  name: '/online',
  description: 'Подключиться к сервису',
  evetns: [
    {
      name: 'notification',
      description: 'У пользователя новое уведомление',
      body: [
        { name: 'notification', type: 'UserNotificationEntity', value: 'UserNotificationEntity' },
      ]
    },
  ],
  actions: [],
}
