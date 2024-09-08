import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserContract {
  @IsEmail({}, { message: 'Электронная почта не валидна' })
  email: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль является обязательным параметром' })
  password: string

  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя является обязательным параметром' })
  firstname: string

  middlename?: string
  lastname?: string
  avatar?: string
}

export class LoginUserContract {
  @IsEmail({}, { message: 'Электронная почта не валидна' })
  email: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль является обязательным параметром' })
  password: string
}

export class CreateCommandContract {
  name?: string
  avatar?: string
  participantsHash?: string[]
}

export class ChangePasswordContract {
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Введите текущий пароль' })
  currentPassword: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Введите новый пароль' })
  newPassword: string
}

export class UpdateProfileContract {
  firstname?: string
  middlename?: string
  lastname?: string
  avatar?: string
}
