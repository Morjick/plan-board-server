
import { Security } from '~/libs/Security'
import { ServerErrorResponse } from '~/data/constants/Responses'

export const AuthMiddleware = async (request: any, response: any, next?: (err?: any) => any) => {
  try {
    const token: string = request.headers.authorization

    const tokenResponse = await Security.checkToken(token)
    if (tokenResponse.exception.type !== 'OK') return response.status(tokenResponse.status).json(tokenResponse)

    request.token = token
    request.userHash = tokenResponse.body.hash
    next()
  } catch {
    const error = response.status(ServerErrorResponse.status).json(ServerErrorResponse)
    next(error)
  }
}
