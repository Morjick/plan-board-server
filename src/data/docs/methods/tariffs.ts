import { NotFoundResponse, OKResponse, ServerErrorResponse, UpdatedResponse } from '~/data/constants/Responses'
import { IApiHTTPMethod } from '~/data/interfaces/docs.interfaces'

export const tariffMethods: IApiHTTPMethod[] = [
  {
    id: 'get-tariffs',
    method: 'GET',
    path: 'list',
    section: 'tariffs',
    requiredAuth: false,
    description: 'Получить список тарифов',
    responses: [
      { ...OKResponse, body: { list: { value: 'TariffEntity[]', type: 'TariffEntity' } } },
      ServerErrorResponse,
    ],
  },
  {
    id: 'change-tariff',
    method: 'PUT',
    path: 'change-tariff',
    section: 'tariffs',
    requiredAuth: true,
    description: 'Сменить тариф',
    responses: [
      ServerErrorResponse,
      NotFoundResponse,
      { ...UpdatedResponse, body: { tariff: { value: 'TariffEntity', type: 'TariffEntity' } } },
    ],
    params: [
      { name: 'type', required: true, value: 'basic | advanced | pro', },
    ]
  }
]
