
import { Emitter } from '~/libs/Emitter'
import { UserEntity } from '~/entities/user/UserEntity'

export class UserReposity {
  private list: UserEntity[] = []

  public emitter = new Emitter()

  public get online () {
    return this.list.length
  }

  constructor () {}

  public addUser (user: UserEntity) {
    user.emitter.on('disconnect', (user: UserEntity) => {
      this.list = this.list.filter((el) => el.id !== user.id)
    })

    user.online = true
    this.list.push(user)
  }

  public userInLocation (location: string) {
    return this.list.filter((user) => user.location == location)
  }

  public async findUser (userHash: string) {
    const onlineUser = this.list.find((el) => el.hash == userHash)

    if (onlineUser) return onlineUser

    const user = new UserEntity()
    await user.findByHash(userHash)

    return user
  }

  public findOnlineUser (userHash: string) {
    return this.list.find((el) => el.hash == userHash)
  }
}
