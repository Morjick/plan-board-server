
import { AlreadyExistResponse, createReponse, OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { Body, Get, JsonController, Post, Req, UseBefore } from 'routing-controllers'
import { CreateDirectoryContract, CreateWorkspaceContract } from '~/data/contracts/projects.contracts'
import { AuthMiddleware } from '~/middlewares/auth,middleware'
import { Directories } from '~/data/database/models/projects/DirectoryModel'
import { Libs } from '~/libs/Libs'
import { Reposity } from '~/data/reposity'
import { WorkspaceEntity } from '~/entities/projects/WorkspaceEntity'

@JsonController('/projects')
export class ProjectController {

  @Post('/workspace')
  @UseBefore(AuthMiddleware)
  async createWorkspace (@Req() request, @Body() body: CreateWorkspaceContract) {
    const userHash = request.userHash
    const user = await Reposity.users.findUser(userHash)

    return await WorkspaceEntity.create(user, body)
  }

  @Get('/list')
  @UseBefore(AuthMiddleware)
  async getWorkspaces (@Req() request) {
    try {
      const userHash = request.userHash
      const user = await Reposity.users.findUser(userHash)
  
      const workspaces = await user.getWorkspaces()
  
      return createReponse(OKResponse, {
        workspaces: workspaces,
      })
    } catch (e) {
      return createReponse(ServerErrorResponse, {
        error: new Error(e).message
      })
    }
  }

  @Post('/create-directory')
  @UseBefore(AuthMiddleware)
  async createDirectory (@Req() request, @Body() body: CreateDirectoryContract) {
    try {
      const userHash = request.userHash
      const user = await Reposity.users.findUser(userHash)

      const isDirectoryExists = await Directories.findOne({ where: { name: body.name }, attributes: ['id'] })
      if (isDirectoryExists) return createReponse(AlreadyExistResponse, {
        message: 'Директория с таким именем уже существует'
      })
  
      await Directories.create({
        autorHash: user.hash,
        name: body.name,
        parrentID: body.directoryID || null,
        hash: Libs.randomString(24),
      })
  
      return createReponse(OKResponse, {
        message: 'Директория создана'
      })
    } catch (e) {
      return createReponse(ServerErrorResponse, {
        message: 'Не удалось создать директорию',
        details: new Error(e).message,
      })
    }
  }

}
