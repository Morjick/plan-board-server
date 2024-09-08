import { IResponse } from './server.interfaces'

type THTTPMethod = 'GET' | 'PATCH' | 'PUT' | 'POST' | 'DELETE'

export interface IHTTPParams {
  name: string
  required: boolean
  value: string
  type?: string
}

export interface IApiHTTPMethod {
  id: string
  method: THTTPMethod
  path: string
  section: string
  description?: string
  requiredAuth?: boolean
  responses?: IResponse[]
  params?: IHTTPParams[]
}

export interface IEntityParam {
  name: string
  value: string
  type: string
}

export interface IEntity {
  params: IEntityParam[]
  name: string
}

export interface ISocketEvent {
  name: string
  description: string
  body: IEntityParam[]
}

export interface IAction {
  message: string
  description: string
  params: IEntityParam[]
}

export interface ISocketNameSpace {
  id: string
  name: string
  description: string
  evetns: ISocketEvent[]
  actions: IAction[]
}

export interface IUnionType {
  name: string
  values: string[]
}
