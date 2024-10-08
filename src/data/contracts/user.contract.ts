import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'

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

export class ForgetPasswordContract {
  @IsEmail({}, { message: 'Электронная почта не валидна' })
  email: string
}

export class VerifyForgottenCodeContract extends ForgetPasswordContract {
  @IsNotEmpty({ message: 'Код для восстановления обязателен' })
  @Length(6, 6, { message: 'Длинна кода должна составлять 6 символов' })
  code: string
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

export class EmailVerificationContract {
  @IsEmail({}, { message: 'Почта не валидна' })
  email: string

  @IsNumber({}, { message: 'Верификационный код должен быть числом' })
  code: number
}

export class SendEmailVerifyCodeContract {
  @IsEmail({}, { message: 'Почта не валидна' })
  email: string
}

export class UpdateProfileContract {
  firstname?: string
  middlename?: string
  lastname?: string
  avatar?: string
}

export class SetNewPasswordContract {
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string

  @IsEmail({}, { message: 'Электронная почта не валидна' })
  email: string
}
