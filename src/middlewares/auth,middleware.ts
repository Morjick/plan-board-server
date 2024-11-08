
import { IUserPermissions, UserPermissions } from '~/libs/Permissions'
import { Request, Response } from 'express'
import { Security } from '~/libs/Security'
import { ServerErrorResponse } from '~/data/constants/Responses'
import { UserEntity } from '~/entities/user/UserEntity'

export interface IRequest extends Request {
  token?: string
  userHash?: string
  permissions: IUserPermissions
}

export const AuthMiddleware = async (request: IRequest, response: Response, next?: (err?: any) => any) => {
  try {
    const token: string = request.headers.authorization

    const tokenResponse = await Security.checkToken(token)
    if (tokenResponse.exception.type !== 'OK') return response.status(tokenResponse.status).json(tokenResponse)

    const user = new UserEntity()
    await user.findByHash(tokenResponse.body.hash)

    const permissions = UserPermissions.getPermissions(user.role)

    request.token = token
    request.userHash = tokenResponse.body.hash
    request.permissions = permissions
    next()
  } catch {
    const error = response.status(ServerErrorResponse.status).json(ServerErrorResponse)
    next(error)
  }
}
