import { createReponse, OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { IUserNotification, UserNotification } from '~/data/database/models/user/UserNotificationModel'

export interface ICreateNotification {
  message: string
  userID: number
  href?: string
}

export class UserNotificationEntity {
  id: number
  message: string
  viewed: boolean
  date: string
  userID: number

  constructor () {}

  public async findByID (id: number) {
    const data = await UserNotification.findByPk(id)
    const notification = data.dataValues

    this.id = notification.id
    this.message = notification.message
    this.viewed = notification.viewed
    this.date = notification.date
    this.userID = notification.userID
  }

  public setData (notification: IUserNotification) {
    this.id = notification.id
    this.message = notification.message
    this.viewed = notification.viewed
    this.date = notification.date
    this.userID = notification.userID
  }

  public static async findAll (userID: number): Promise<UserNotificationEntity[]> {
    const data = await UserNotification.findAll({ where: { userID }, limit: 50, })

    const notifications = data.map((data) => {
      const item = new UserNotificationEntity()
      item.setData(data)

      return item
    })

    return notifications
  }

  public static async create (data: ICreateNotification) {
    try {
      const response = await UserNotification.create({
        message: data.message,
        date: new Date().toLocaleString('ru'),
        userID: data.userID,
        href: data.href || null
      })

      const notification = new UserNotificationEntity()
      notification.setData(response.dataValues)

      return createReponse(OKResponse, {
        notification,
      })
    } catch (e) {
      return createReponse(ServerErrorResponse, {
        message: 'Не удалось создать уведомление'
      })
    }
  }

  public static async delete (id: number) {
    try {
      await UserNotification.destroy({ where: { id } })
      
      return OKResponse
    } catch (e) {
      return createReponse(ServerErrorResponse, {
        message: 'Не удалось удалить уведомление',
        details: new Error(e).message
      })
    }
  }
}
