import { OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { IApiHTTPMethod } from '~/data/interfaces/docs.interfaces'

export const staticMethods: IApiHTTPMethod[] = [
  {
    id: 'upload-file',
    method: 'POST',
    path: 'upload-file',
    section: 'static',
    requiredAuth: false,
    description: 'Загрузить файл',
    responses: [
      OKResponse,
      ServerErrorResponse,
    ],
    params: [
      { name: 'file', required: true, value: 'formdata', },
    ],
  },
  {
    id: 'get-file',
    method: 'GET',
    path: 'get-file/:directory/:filenam',
    section: 'static',
    requiredAuth: false,
    description: 'Получить файл',
    responses: [
      OKResponse,
      ServerErrorResponse,
    ],
    params: [],
  },
]