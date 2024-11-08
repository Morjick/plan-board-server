import { createReponse, OKResponse, ServerErrorResponse, UnauthorizedResponse } from '~/data/constants/Responses'
import { IApiHTTPMethod } from '~/data/interfaces/docs.interfaces'

export const projectsMethods: IApiHTTPMethod[] = [
  {
    id: 'create-workspace',
    method: 'POST',
    path: 'create-workspace',
    section: 'projects',
    requiredAuth: true,
    description: 'Создать рабочее пространвство',
    responses: [
      OKResponse,
      ServerErrorResponse,
      UnauthorizedResponse,
    ],
    params: [],
  },
  {
    id: 'get-projects',
    method: 'GET',
    path: 'list',
    section: 'projects',
    requiredAuth: true,
    description: 'Получить список проектов',
    responses: [
      createReponse(OKResponse, {
        workspaces: 'WorkspaceEntity'
      }),
      ServerErrorResponse,
      UnauthorizedResponse,
    ],
    params: [],
  },
  {
    id: 'get-catalog',
    method: 'GET',
    path: 'catalog/:hash',
    section: 'projects',
    requiredAuth: true,
    description: 'Получить весь каталог',
    responses: [
      createReponse(OKResponse, {
        catalog: 'Array<WorkspaceEntity | IDirectory | IDirectoryFile>'
      }),
      ServerErrorResponse,
      UnauthorizedResponse,
    ],
    params: [],
  },
]
