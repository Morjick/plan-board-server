import { createRandomNumber } from './methods/createRandomNumber'
import { createRandomString } from './methods/createRandomString'
import getTransplit from './methods/getTranslate'
import { IsValidPassword } from './methods/isValidVassword'

interface IDate {
  day: number
  mounth: number
  year: number
}

interface ITime {
  hourse: number
  minutes: number
  seconds: number
}

export interface IDiferenceEntry {
  name: string
  value: number
}

export interface IParsedDate {
  date: IDate
  time: ITime
}

export class Libs {
  constructor () {}

  public static getDate (): string {
    return new Date().toLocaleString('ru')
  }

  public static paseDate (candidat: string): IParsedDate {
    const [date, time] = candidat.split(' ')

    if (!date || !time) return

    const [hourse, minutes, seconds] = time.split(':').map((el) => Number(el))
    const [day, mounth, year] = date.split('.').map((el) => Number(el.replace(',', '')))

    return {
      date: { day, mounth, year },
      time: { hourse, minutes, seconds },
    }
  }

  public static getDifference (start: IParsedDate, end: IParsedDate) {
    const dateStart = new Date(Libs.formatDate(start))
    const dateEnd = new Date(Libs.formatDate(end))

    const result = (dateEnd.valueOf() - dateStart.valueOf())

    return {
      hource: Math.round(result / (1000 * 60 * 60)),
      minutes:  Math.round(result / (1000 * 60)),
      seconds:  Math.round(result / (1000)),
      days: Math.round(result / (1000 * 60 * 60 * 24)),
    }
  }

  public static formatDate (date: IParsedDate) {
    const month = date.date.mounth >= 10 ? date.date.mounth : `0${date.date.mounth}`
    return `${date.date.year}-${month}-${date.date.day} ${date.time.hourse}:${date.time.minutes}:${date.time.seconds}`
  }

  public static randomString (length: number = 20): string {
    return createRandomString(length)
  }

  public static randomNumber (min: number = 1, max: number = 1000) {
    return createRandomNumber(min, max)
  }

  public static transplit (text: string) {
    return getTransplit(text)
  }

  public static checkValidPassword (password: string, name?: string) {
    return IsValidPassword(password, name || null)
  }
}
