
import { BadRequestResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { NextFunction, Request, Response } from 'express'
import { validate, ValidationError } from 'class-validator'
import bodyParser from 'body-parser'

export const ValidationMiddleware = async (request: Request, response: Response, next: NextFunction, Validation:any) => {
  try {
    const validation = new Validation()

    const jsonParser = bodyParser.json()
    jsonParser(request, response, () => {
      for (const property in request.body) {
        validation[property] = request.body[property]
      }


      validate(validation).then((errors: ValidationError[]) => {
        if (!errors.length) {
          return next()
        } else {
          const validErrors = errors.map((el) => {
            const messages = []

            for (const message in el.constraints) {
              messages.push(el.constraints[message])
            }

            return {
              property: el.property,
              messages,
            }
          })

          const error = response
            .status(BadRequestResponse.status)
            .json({...BadRequestResponse, body: { errors: validErrors, } })
          next(error)
        }
      })
    })
  } catch (e) {
    const error = response.status(ServerErrorResponse.status).json(ServerErrorResponse)
    next(error)
  }
}
