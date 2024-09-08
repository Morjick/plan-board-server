import { OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { IApiHTTPMethod } from '~/data/interfaces/docs.interfaces'

export const appMethods: IApiHTTPMethod[] = [
  {
    id: 'get-docs',
    method: 'GET',
    path: 'get-docs',
    section: 'app',
    requiredAuth: false,
    description: 'Метод для создания пользователя и регистрации',
    responses: [
      OKResponse,
      ServerErrorResponse,
    ],
    params: [],
  },
]
