
import { Middleware, MiddlewareInterface } from 'socket-controllers'

import { NextFunction } from 'express'
// import { Reposity } from '~/data/reposity'
// import { Security } from '~/libs/Security'
import { Service } from 'typedi'
import { Socket } from 'socket.io'
import { Sockets } from '~/libs/Sockets'
import { UnauthorizedResponse } from '~/data/constants/Responses'

@Service()
@Middleware({namespace: ['/online']})
export class ConnectionMiddleware implements MiddlewareInterface {
  async use(socket: Socket, next: NextFunction) {
    try {
      const isAuth = await Sockets.checkAuth(socket)

      if (!isAuth) return next(UnauthorizedResponse)

      socket.handshake.auth = isAuth.auth
      socket.handshake.auth.location = isAuth.location
      next()
    } catch (e) {
      next(JSON.stringify(UnauthorizedResponse))
    }
  }
}
