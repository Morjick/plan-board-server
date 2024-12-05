export type TServerMode = 'production' | 'development'
export type TExceptionType = 'Unauthorized' | 'Unexcepted' | 'PermissionDenied'
    | 'NotFound' | 'InvalidRequest' | 'AlreadyExist' | 'OK'
    | 'Created' | 'Updated' | 'Deleted'

export type TResponseStatus = 200 | 201 | 202 | 204 | 400 | 401 | 403 | 404 | 409 | 501
export type TToastType = 'warning' | 'error' | 'cool'

export interface IException {
  type: TExceptionType
  message: string
}

export interface IToast {
  type: TToastType
  message: string
}

export interface IResponse<IResponseBody = any> {
  status: TResponseStatus
  toast?: IToast
  exception: IException
  body?: IResponseBody
  error?: string
}
