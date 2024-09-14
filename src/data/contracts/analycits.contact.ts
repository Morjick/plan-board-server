import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { THelpPage } from '../database/models/analytics/AnalyticsHelp'

export class HelpClickContract {
  @IsNotEmpty({ message: 'userID является обязательным параметром' })
  @IsNumber({}, { message: 'ID пользователя должен быть числом' })
  userID: number

  @IsString({ message: 'Страница является обязательным элементом' })
  page: THelpPage
}

export class ErrorPageContract {
  @IsNotEmpty({ message: 'status является обязательным параметром' })
  @IsNumber({}, { message: 'status должен быть числом' })
  status: number

  @IsNotEmpty({ message: 'userID является обязательным параметром' })
  @IsNumber({}, { message: 'ID пользователя должен быть числом' })
  userID: number

  message?: string
}
