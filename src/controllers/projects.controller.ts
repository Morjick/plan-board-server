
import { createReponse, OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { Get, JsonController, Post, Req, UseBefore } from 'routing-controllers'
import { AuthMiddleware } from '~/middlewares/auth,middleware'
import { Reposity } from '~/data/reposity'
import { WorkspaceEntity } from '~/entities/projects/WorkspaceEntity'

@JsonController('/projects')
export class ProjectController {

  @Post('/workspace')
  @UseBefore(AuthMiddleware)
  async createWorkspace (@Req() request) {
    const userHash = request.userHash
    const user = await Reposity.users.findUser(userHash)

    return await WorkspaceEntity.create(user)
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
}
