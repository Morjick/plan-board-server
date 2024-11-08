
import { createReponse, NotFoundResponse, OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { Promocodes } from '~/data/database/models/promocodes/Promocodes'
import { UserProfileAttrebutes } from '../user/UserEntity'
import { Users } from '~/data/database/models/user/UserModel'

export class PromocodeEntity {
  public static async findByHash (hash: string) {
    try {
      const promocode = await Promocodes.findOne({
        where: { hash },
        include: [
          {
            as: 'autor',
            model: Users,
            attributes: UserProfileAttrebutes
          }
        ]
      })

      if (!promocode) return createReponse(NotFoundResponse, { message: 'Промокод не найден' })

      return createReponse(OKResponse, {
        promocode: promocode.dataValues
      })
    } catch (e) {
      return ServerErrorResponse
    }
  }

  public static async create () {

  }
}
