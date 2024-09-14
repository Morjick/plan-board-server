
import { ConnectedSocket, OnConnect, OnDisconnect, SocketController } from 'socket-controllers'
import { Reposity } from '~/data/reposity'
import { Service } from 'typedi'
import { Socket } from 'socket.io'
import { UserAnalyticsEntity } from '~/entities/analytics/UserAnalyticsEntity'

@Service()
@SocketController('/online')
export class OnlineController {

  @OnConnect()
  async connect (@ConnectedSocket() socket: Socket) {
    socket.emit('connected')
  }

  @OnDisconnect()
  async disconnect (@ConnectedSocket() socket: Socket) {
    const user = await Reposity.users.findUser(socket.handshake.auth.hash)

    user.disconnect()
    UserAnalyticsEntity.createSessionEntry({ userID: user.id, start: socket.handshake.auth.sessionStart })
  }
}
