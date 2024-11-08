import { JsonController, Post, UseBefore } from 'routing-controllers'

@JsonController('/promocodes')
export class PromocodesController {

  @Post('/create')
  @UseBefore()
  create () {

  }
}
