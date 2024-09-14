
import { Body, Delete, Get, JsonController, Params, Patch, Post, Put, Req, UseBefore } from 'routing-controllers'
import {
  ChangePasswordContract,
  CreateUserContract,
  ForgetPasswordContract,
  LoginUserContract,
  UpdateProfileContract,
  VerifyForgottenCodeContract
} from '~/data/contracts/user.contract'
import { NotFoundResponse, ServerErrorResponse } from '~/data/constants/Responses'

import { AuthMiddleware } from '~/middlewares/auth,middleware'
import { IResponse } from '~/data/interfaces/server.interfaces'
import { Reposity } from '~/data/reposity'
import { UserEntity } from '~/entities/user/UserEntity'
import { ValidationMiddleware } from '~/middlewares/validation.middleware'

@JsonController('/users')
export class UserController {

  @Post('/sign-up')
  @UseBefore((req, res, next) => ValidationMiddleware(req, res, next, CreateUserContract))
  async signUp (@Body() body: CreateUserContract): Promise<IResponse> {
    return await UserEntity.registration(body)
  }

  @Post('/login')
  @UseBefore((req, res, next) => ValidationMiddleware(req, res, next, LoginUserContract))
  async login (@Body() body: LoginUserContract) {
    return await UserEntity.login(body)
  }

  @Get('/check-token')
  @UseBefore(AuthMiddleware)
  async checkToken (@Req() request) {
    const token: string = request.token
    return await UserEntity.checkToken(token)
  }

  @Post('/update-token')
  async updateToken (@Body() body) {
    const token = body.token
    return await UserEntity.updateToken(token)
  }

  @Delete('/profile')
  @UseBefore(AuthMiddleware)
  async deleteUser (@Req() request) {
    return await UserEntity.deleteUser(request.userHash)
  }

  @Get('/profile')
  @UseBefore(AuthMiddleware)
  async getProfile (@Req() request): Promise<IResponse> {
    try {
      const hash = request.userHash
      const user = await Reposity.users.findUser(hash)

      if (!user) return NotFoundResponse

      return {
        status: 200,
        exception: { type: 'OK', message: 'Профиль получен' },
        body: {
          profile: user.profile
        },
      }
    } catch (e) {
      return { ...ServerErrorResponse, body: { error: new Error(e).message, } }
    }
  }

  @Get('/profile/:hash')
  async getUserProfile (@Params() params): Promise<IResponse> {
    try {
      const hash = params.hash

      const user = await Reposity.users.findUser(hash)
      if (!user) return NotFoundResponse

      return {
        status: 200,
        exception: { type: 'OK', message: 'Профиль получен' },
        body: { profile: user.profile }
      }
    } catch {
      return ServerErrorResponse
    }
  }

  @Put('/change-password')
  @UseBefore(AuthMiddleware)
  @UseBefore((req, res, next) => ValidationMiddleware(req, res, next, ChangePasswordContract))
  async changePassword (@Body() body: ChangePasswordContract, @Req() request) {
    const user = await Reposity.users.findUser(request.userHash)

    return await user.changePassword(body)
  }

  @Patch('/update-profile')
  @UseBefore(AuthMiddleware)
  @UseBefore((req, res, next) => ValidationMiddleware(req, res, next, UpdateProfileContract))
  async updateProfile (@Req() request, @Body() body: UpdateProfileContract) {
    const userHash = request.userHash

    const user = await Reposity.users.findUser(userHash)
    if (!user) return NotFoundResponse

    return await user.updateProfile(body)
  }

  @Post('/forget-password')
  async forgetPassword (@Body() body: ForgetPasswordContract) {
    return await UserEntity.generateForgottenCode(body.email)
  }

  @Post('/verify-code')
  async verifyForgottenCode (@Body() body: VerifyForgottenCodeContract) {
    return await UserEntity.verifyForgottenCode(body.email, body.code)
  }
}
