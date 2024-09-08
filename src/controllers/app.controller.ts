
import { Get, JsonController } from 'routing-controllers'
import { methods, namespaces, types } from '~/data/docs/methods.doc'
import { entities } from '~/data/docs/entity.doc'
import { IResponse } from '~/data/interfaces/server.interfaces'

@JsonController('/app')
export class AppController {

  @Get('/get-docs')
  async getDocs (): Promise<IResponse> {
    return {
      status: 200,
      exception: { type: 'OK', message: 'Документация получена' },
      body: {
        methods: methods,
        entities: entities,
        namespaces: namespaces,
        types: types,
        version: '0.1',
      }
    }
  }
}
