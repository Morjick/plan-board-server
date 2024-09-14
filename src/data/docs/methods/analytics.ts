import { OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { IApiHTTPMethod } from '~/data/interfaces/docs.interfaces'

export const analyticsMethods: IApiHTTPMethod[] = [
  {
    id: 'help-click',
    method: 'POST',
    path: 'help-click',
    section: 'analytics',
    requiredAuth: false,
    description: 'Если пользователь на какой-либо странице нажал на "нужна помощь"',
    responses: [
      OKResponse,
      ServerErrorResponse,
    ],
    params: [
      { name: 'userID', required: true, value: 'number', },
      { name: 'page', required: true, value: 'THelpPage', type: 'THelpPage' },
    ],
  },
  {
    id: 'on-error',
    method: 'POST',
    path: 'on-error',
    section: 'analytics',
    requiredAuth: false,
    description: 'Если пользователь получил какую-либо необработанную ошибку',
    responses: [
      OKResponse,
      ServerErrorResponse,
    ],
    params: [
      { name: 'status', required: true, value: 'number', },
      { name: 'userID', required: true, value: 'number', },
      { name: 'message', required: false, value: 'string', },
    ],
  },
]
