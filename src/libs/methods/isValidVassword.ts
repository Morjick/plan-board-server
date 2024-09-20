import getTransplit from './getTranslate'

export interface ICheckPasswordResponse {
  message: string
  ok: boolean
  warning?: boolean
}

export async function IsValidPassword(password: string, name?: string): Promise<ICheckPasswordResponse> {
  if (password.includes(' ')) return {
    message: 'Пожалуйста, не используйте пробелы',
    ok: false,
    warning: false,
  }

  if (password.replace(' ', '').length < 6) return { message: 'Минимальная длинна пароля - 6 символов', ok: false, warning: false }

  if (
    name &&
    (password == name ||
      name.toLocaleLowerCase() ==
        (await getTransplit(password)).toLocaleLowerCase())
  ) {
    return {
      message: 'Не используйте в качестве пароля своё имя, даже в транслите',
      ok: false,
      warning: false,
    }
  }

  if (
    password.includes('1234') ||
    password.includes('qwer') ||
    password.includes('zxcv') ||
    password.includes('123456789')
  )
    return {
      message:
        'Старайтесь избегать в пароле сочитания цифр от 1 до 9 и буквенно-строчные сочитания (например, qwerty). Так злоумышленник сможет легко Вас взломать',
      ok: false,
      warning: false,
    }

  const blacklist = [
    'password',
    'password1',
    'password2',
    'password3',
    'password4',
    'password5',
    'password6',
    'password7',
    'password8',
    'password9',
    'password0',
    '000000',
    '111111',
    '222222',
    '333333',
    '444444',
    '555555',
    '666666',
    '777777',
    '888888',
    '999999',
    'a123456',
    'qwerty',
    'guest',
    'batman',
    'master',
    'gfhjkm',
    '1q2w3e4r5t6y',
    'hjccnz',
    'baltika9',
    'monkey',
  ]

  const isPasswordInBlackList = blacklist.includes(password.toLocaleLowerCase())
  if (isPasswordInBlackList) return { message: 'Пароль слишком простой', ok: false, warning: false }

  return {
    message: 'Пароль отлично подошёл',
    ok: true,
    warning: false,
  }
}
