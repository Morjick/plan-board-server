
import * as jwt from 'jsonwebtoken'

import { BadRequestResponse, createReponse, OKResponse, ServerErrorResponse, UnauthorizedResponse, } from '~/data/constants/Responses'

import AES  from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import { IResponse } from '~/data/interfaces/server.interfaces'

interface IGetAuthTokenData {
  hash: string
  password: string
  firstname: string
}

interface ICheckTokenResponse {
  hash: string
  firstname: string
}

const SECRET_KEY = process.env.SECRET_KEY

const ACCESS_TOKEN_LIFETIME = '15m'
const REFRESH_TOKEN_LIFETIME = '40d'

export class Security {
  constructor () {}

  public static decode (value: string): string | null {
    try {
      const result = AES.decrypt(value, SECRET_KEY).toString(CryptoJS.enc.Utf8)

      return result
    } catch {
      return null
    }
  }

  public static encode (value: string): string | null {
    try {
      const result = AES.encrypt(value, SECRET_KEY).toString()

      return result
    } catch {
      return null
    }
  }

  public static async getAuthToken (data: IGetAuthTokenData): Promise<[string, string]> {
    const password = data.password

    const accessToken: string = await jwt.sign({ firstname: data.firstname, hash: data.hash }, SECRET_KEY, { expiresIn: ACCESS_TOKEN_LIFETIME, })
    const refreshToken: string = await jwt.sign({ firstname: data.firstname, password, hash: data.hash }, SECRET_KEY, { expiresIn: REFRESH_TOKEN_LIFETIME, })

    return [accessToken, refreshToken]
  }

  public static async checkToken (token: string): Promise<IResponse<ICheckTokenResponse>> {
    try {
      if (!token) return UnauthorizedResponse
      const { hash, firstname } = jwt.verify(token, SECRET_KEY, { secret: SECRET_KEY })

      if (!hash) throw new Error()

      return createReponse(OKResponse, { hash, firstname })
    } catch (error) {
      if (error == 'TokenExpiredError: jwt expired') return createReponse(UnauthorizedResponse, { message: 'Срок действия токена истёк' })

      return ServerErrorResponse
    }
  }

  public static async comparePassword (candidat: string, password: string): Promise<IResponse> {
    try {
      const parsedPassword = Security.decode(password)
      const isPassword = parsedPassword == candidat

      if (!isPassword) return {
        status: 409,
        exception: {
          type: 'InvalidRequest',
          message: 'Пароль не совпадают'
        }
      }

      return {
        status: 200,
        exception: {
          type: 'OK',
          message: 'Пароль подтверждён'
        }
      }
    } catch {
      return BadRequestResponse
    }
  }

  public static async updateToken (token: string): Promise<IResponse> {
    try {
      const response = await Security.checkToken(token)

      if (response.exception.type !== 'OK') return response

      const data = response.body
      const accessToken = await jwt.sign({ firstname: data.firstname, hash: data.hash }, SECRET_KEY, { expiresIn: ACCESS_TOKEN_LIFETIME, })

      return {
        status: 200,
        exception: {
          type: 'OK',
          message: 'Новый токен получен'
        },
        body: {
          accessToken,
        }
      }
    } catch {
      return ServerErrorResponse
    }
  }
}
