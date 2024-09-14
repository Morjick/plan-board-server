
import { Body, JsonController, Post } from 'routing-controllers'
import { ErrorPageContract, HelpClickContract } from '~/data/contracts/analycits.contact'
import { OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { AnalyticsErrorPage } from '~/data/database/models/analytics/AnalyticsErrorPage'
import { AnalyticsHelp } from '~/data/database/models/analytics/AnalyticsHelp'

@JsonController('/analytics')
export class AnalyticsController {

  @Post('/help-click')
  async helpClick (@Body() body: HelpClickContract) {
    try {
      await AnalyticsHelp.create({ userID: body.userID, page: body.page })

      return OKResponse
    } catch {
      return ServerErrorResponse
    }
  }

  @Post('/on-error')
  async onError (@Body() body: ErrorPageContract) {
    try {
      await AnalyticsErrorPage.create({ userID: body.userID, status: body.status, message: body.message })

      return OKResponse
    } catch {
      return ServerErrorResponse
    }
  }
}
