
import { Reposity } from '~/data/reposity'
import { Security } from './Security'
import { Socket } from 'socket.io'

export class Sockets {
  public static getHash (path: string) {
    const parsed = path.split('/')

    return parsed[2]
  }

  public static async checkAuth (socket: Socket) {
    const token = socket.handshake.headers.authorization

    const response = await Security.checkToken(token) 

    if (response.exception.type !== 'OK') return null

    const hash = response.body.hash
    const user = await Reposity.users.findUser(hash)

    user.socket = socket

    Reposity.users.addUser(user)

    return {
      auth: user.fullProfile,
      location: user.location,
    }
  }
}
