import { AnalyticsSessions } from '~/data/database/models/analytics/AnalyticsSessions'
import { Libs } from '~/libs/Libs'

interface ICreateSessionEntryContract {
  userID: number
  start: string
}

export class UserAnalyticsEntity {

  public static async createSessionEntry (data: ICreateSessionEntryContract) {
    const end = Libs.getDate()

    const startDatemark = Libs.paseDate(data.start)
    const endDatemark = Libs.paseDate(end)

    const result = Libs.getDifference(startDatemark, endDatemark)

    await AnalyticsSessions.create({
      userID: data.userID,
      start: data.start,
      end: end,
      hourse: result.hource,
      minutes: result.minutes,
      seconds: result.seconds,
    })
  }
}
