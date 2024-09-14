
import { AnalyticsErrorPage } from './models/analytics/AnalyticsErrorPage'
import { AnalyticsHelp } from './models/analytics/AnalyticsHelp'
import { AnalyticsSessions } from './models/analytics/AnalyticsSessions'
import { Directories } from './models/projects/DirectoryModel'
import { DirectoryFiles } from './models/projects/FilesModel'
import { ForgottenCodes } from './models/user/ForgottenCodes'
import { Participants } from './models/projects/ParticipantModel'
import { Projects } from './models/projects/ProjectModel'
import { Sequelize } from 'sequelize-typescript'
import { Spaces } from './models/projects/SpaceModel'
import { TServerMode } from '../interfaces/server.interfaces'
import { UserNotification } from './models/user/UserNotificationModel'
import { Users } from './models/user/UserModel'

export interface DataBaseConstructorInterface {
  HOST: string | number
  USER: string
  PASWORD: string
  DB: string
  PORT: string | number
  MODE: TServerMode
}

export const startDataBase = async (data: DataBaseConstructorInterface) => {
  const dataBaseConfig = {
    HOST: data.HOST,
    USER: data.USER,
    PASSWORD: data.PASWORD,
    DB: data.DB,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }

  const database = new Sequelize(
    dataBaseConfig.DB,
    dataBaseConfig.USER,
    String(dataBaseConfig.PASSWORD),
    {
      host: String(dataBaseConfig.HOST),
      dialect: 'postgres',
      pool: {
        max: dataBaseConfig.pool.max,
        min: dataBaseConfig.pool.min,
        acquire: dataBaseConfig.pool.acquire,
        idle: dataBaseConfig.pool.idle,
      },
      logging: false,
      port: Number(data.PORT),
      models: [
        Users,
        Projects,
        Participants,
        UserNotification,
        Spaces,
        ForgottenCodes,
        AnalyticsSessions,
        AnalyticsHelp,
        AnalyticsErrorPage,
        Directories,
        DirectoryFiles,
      ],
    }
  )

  try {
    await database.authenticate()

    if (data.MODE == 'development') {
      await database.sync({ alter: true })
    }
  } catch (e) {
    console.error('Ошибка при подключении к базе данных', e)
  }
}
