
import { Body, Get, JsonController, Put, Req, UseBefore } from 'routing-controllers'
import { OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { AuthMiddleware } from '~/middlewares/auth,middleware'
import { ChangeTariffContract } from '~/data/contracts/tariff.contract'
import { IResponse } from '~/data/interfaces/server.interfaces'
import { Reposity } from '~/data/reposity'
import { TariffEntity } from '~/entities/tariff/TariffEntity'
import { ValidationMiddleware } from '~/middlewares/validation.middleware'


@JsonController('/tariffs')
export class TariffController {

  @Get('/list')
  async getList (): Promise<IResponse> {
    return {
      ...OKResponse,
      body: { list: TariffEntity.list },
    }
  }

  @Put('/change-tariff')
  @UseBefore(AuthMiddleware)
  @UseBefore((req, res, next) => ValidationMiddleware(req, res, next, ChangeTariffContract))
  async updateTariff (@Req() request, @Body() body: ChangeTariffContract): Promise<IResponse> {
    try {
      const userHash = request.userHash

      const user = await Reposity.users.findUser(userHash)
      if (!user) return { status: 404, exception: { type: 'NotFound', message: 'Пользователь не найден' } }

      const tariff = TariffEntity.getTariff(body.type)
      if (!tariff) return { status: 404, exception: { type: 'NotFound', message: 'Пользователь не найден' } }

      return await user.changeTariff(tariff)
    } catch {
      return ServerErrorResponse
    }
  }
}
