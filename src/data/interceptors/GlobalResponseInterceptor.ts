import {
  Action,
  Interceptor,
  InterceptorInterface,
} from 'routing-controllers'
import { IResponse, TResponseStatus } from '../interfaces/server.interfaces'
import { InternalServerErrorResponse } from '../constants/Responses'
import { ServerVersion } from '../constants/Server'

interface ContentInterface extends IResponse {
  version: string
}

@Interceptor()
export class GlobalResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: IResponse): ContentInterface {
    if (!content?.status || !content?.exception) {
      return { ...InternalServerErrorResponse, version: ServerVersion }
    }
    const response: ContentInterface = {
      status: content.status as TResponseStatus,
      exception: content.exception,
      version: ServerVersion
    }

    if (content.body) { response.body = content.body }
    if (content.error) { response.error = content.error }
    if (content.toast) { response.toast = content.toast }

    action.response.status(content.status)
    return response
  }
}
