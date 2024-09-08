
import { ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController } from 'socket-controllers'
import { IUpdateWorkspace } from '~/entities/projects/WorkspaceEntity'
import { Libs } from '~/libs/Libs'
import { LocationEntity } from '~/entities/user/LocationEntity'
import { Reposity } from '~/data/reposity'
import { Service } from 'typedi'
import { Socket } from 'socket.io'
import { Sockets } from '~/libs/Sockets'
import { UserEntity } from '~/entities/user/UserEntity'

@Service()
@SocketController('/workspace/:hash')
export class WorkspaceController {

  @OnConnect()
  async connect (@ConnectedSocket() socket: Socket) {
    try {
      const workspaceHash = Sockets.getHash(socket.nsp.name)
      const location = new LocationEntity({ location: 'workspace', hash: workspaceHash })
  
      const workspace = await Reposity.workspace.findWorkspace(location)
  
      if (!workspace) {
        socket.emit('error:connection', { message: 'Не смогли найти рабочую область. Проверьте корректность ссылки' })
        socket.disconnect()
        return
      }

      socket.emit('redirect', new LocationEntity({ location: 'workspace:loading', hash: workspace.hash }))
  
      const authUser = await Sockets.checkAuth(socket)
      const isAnonyme = !!!authUser
  
      let user: UserEntity = null
  
      if (!isAnonyme) {
        socket.handshake.auth = authUser.auth
        socket.handshake.auth.location = authUser.location
  
        user = Reposity.users.findOnlineUser(authUser.auth.hash)
      } else {
        const anonymeUser = new UserEntity()
  
        anonymeUser.id = Libs.randomNumber(12000, 15000)
        anonymeUser.hash = socket.handshake.address
        anonymeUser.firstname = 'Анонимный'
        anonymeUser.lastname = 'Пользователь'
        anonymeUser.socket = socket
  
        socket.handshake.auth = anonymeUser.profile
        socket.handshake.auth.location = anonymeUser.location
  
        user = anonymeUser
      }

      workspace.join(user, isAnonyme)
    } catch (e) {
      socket.emit('error:connection', { message: 'Не удалось подключиться к рабочей области' })
      socket.disconnect()
    }
  }

  @OnDisconnect()
  async disconnect (@ConnectedSocket() socket: Socket) {
    const user = Reposity.users.findOnlineUser(socket.handshake.auth.hash)
    if (user?.fullLocation?.location == 'workspace') {
      const workspace = await Reposity.workspace.findWorkspace(user.fullLocation)
      workspace.userLeave(user)
    }

    if (!user) return
    user.disconnect()
  }

  @OnMessage('update-workspace')
  async updateWorkspace (@ConnectedSocket() socket: Socket, @MessageBody() body: IUpdateWorkspace) {
    const workspaceHash = Sockets.getHash(socket.nsp.name)
    const location = new LocationEntity({ location: 'workspace', hash: workspaceHash })

    const workspace = await Reposity.workspace.findWorkspace(location)
    const participant = workspace.findParticipant(socket.handshake.auth.hash)

    await workspace.update(body, participant)
  }
}
