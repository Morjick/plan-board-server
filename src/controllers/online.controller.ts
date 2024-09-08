
import { ConnectedSocket, OnConnect, OnDisconnect, SocketController } from 'socket-controllers'
import { Reposity } from '~/data/reposity'
import { Service } from 'typedi'
import { Socket } from 'socket.io'

@Service()
@SocketController('/online')
export class OnlineController {

  @OnConnect()
  async connect () {

  }

  @OnDisconnect()
  async disconnect (@ConnectedSocket() socket: Socket) {
    const user = await Reposity.users.findUser(socket.handshake.auth.hash)

    user.disconnect()
  }
}
