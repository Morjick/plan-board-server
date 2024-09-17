
import * as path from 'path'

import { createReponse, OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { JsonController, Post, UploadedFile } from 'routing-controllers'
import { Libs } from '~/libs/Libs'
import multer from 'multer'

export const fileDirectoryPath = path.join(__dirname, '../', 'data', 'static', 'files')

export const fileUploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {

      cb(null, fileDirectoryPath)
    },
    filename: (req: any, file: any, cb: any) => {
      const fileNameDots = String(file.originalname).split('.')
      const fileExtention = fileNameDots[fileNameDots.length - 1]

      const uniqueString = `${Date.now()}-${Libs.randomString(18)}.${fileExtention}`
      cb(null, uniqueString)
    },
  }),
  limits: {
    fieldNameSize: '3MB',
  },
}

@JsonController('/static')
export class StaticController {

  @Post('/upload-file')
  uploadFile(@UploadedFile('file', { options: fileUploadOptions }) file: any) {
    try {
      return createReponse(OKResponse, {
        message: 'Файл был загружен',
        path: `files/${file.filename}`
      })
    } catch (e) {
      const error = new Error(e)
      return createReponse(ServerErrorResponse, {
        message: 'Не удалось загрузить файл',
        error: error.message,
        stack: error.stack,
      })
    }
  }
}
