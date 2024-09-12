import { IResponse, IToast } from '../interfaces/server.interfaces'

export const OKResponse: IResponse = {
  status: 200,
  exception: {
    type: 'OK',
    message: 'Запрос прошёл успешно',
  },
}

export const CreatedResponse: IResponse = {
  status: 201,
  exception: {
    type: 'Created',
    message: 'Запись создана',
  },
}

export const UpdatedResponse: IResponse = {
  status: 202,
  exception: {
    type: 'Updated',
    message: 'Запись изменена',
  },
}

export const DeletedResponse: IResponse = {
  status: 204,
  exception: {
    type: 'Delted',
    message: 'Запись удалена',
  },
}

export const BadRequestResponse: IResponse = {
  status: 400,
  exception: {
    type: 'InvalidRequest',
    message: 'Отправлены не валидные данные',
  },
}

export const UnauthorizedResponse: IResponse = {
  status: 401,
  exception: {
    type: 'Unauthorized',
    message: 'Для этого метода необходима авторизация',
  },
}

export const PermissionDeniedResponse: IResponse = {
  status: 403,
  exception: {
    type: 'PermissionDenied',
    message: 'У вас недостаточно прав для выполнения данного запроса',
  },
}

export const NotFoundResponse: IResponse = {
  status: 404,
  exception: {
    type: 'NotFound',
    message: 'Данные не найдены',
  },
}

export const AlreadyExistResponse: IResponse = {
  status: 409,
  exception: {
    type: 'AlreadyExist',
    message: 'Такая запись уже существует. Возможно, в ней повторяются уникальные параметры',
  },
}

export const InternalServerErrorResponse: IResponse = {
  status: 500,
  error: 'InternalServerError',
  exception: {
    type: 'Unexcepted',
    message: 'Не обработанная ошибка сервера'
  },
  toast: {
    type: 'error',
    message: 'В работе сервера произошла необработанная ошибка. Пожалуйста, обратитесь в тех.поддержку'
  },
}

export const createReponse = (response: IResponse, body?: any, toast?: IToast) => {
  const newReponse = { ...response, body: body, toast }

  if (body && 'message' in body) {
    newReponse.exception.message = body.message

    delete body.message
  }

  return newReponse
}

export const ServerErrorResponse = InternalServerErrorResponse
