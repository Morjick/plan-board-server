
import { AlreadyExistResponse, createReponse, NotFoundResponse, OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { Body, Get, JsonController, Params, Post, Req, UseBefore } from 'routing-controllers'
import { CreateDirectoryContract, CreateWorkspaceContract } from '~/data/contracts/projects.contracts'
import { AuthMiddleware } from '~/middlewares/auth,middleware'
import { Directories } from '~/data/database/models/projects/DirectoryModel'
import { DirectoryFiles } from '~/data/database/models/projects/FilesModel'
import { Libs } from '~/libs/Libs'
import { LocationEntity } from '~/entities/user/LocationEntity'
import { Projects } from '~/data/database/models/projects/ProjectModel'
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

      const directoriesData = await Directories.findAll({
        where: { autorHash: user.hash },
        limit: 50,
      })
      const directories = directoriesData.map((el) => { return { ...el, length: 0, autor: user.profile  } })

      const favoritesHash = user.favoritesHash

      const [favorites, workspaces] = await Promise.all([
        favoritesHash.map(async (hash) => {
          const location = new LocationEntity({ location: 'workspace', hash })
          return await Reposity.workspace.findWorkspace(location)
        }),
        await WorkspaceEntity.findByAutor(user.id, user.profile),
      ])

      return createReponse(OKResponse, {
        workspaces: workspaces,
        directories,
        favorites,
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

  @Get('/catalog')
  @Get('/catalog/:parentParam')
  @UseBefore(AuthMiddleware)
  async getCatalog (@Params() params, @Req() request) {
    try {
      const userHash = request.userHash
      const user = await Reposity.users.findUser(userHash)

      let parentID = null
      const parantDirectoryParam = params.parentParam
      let currentDirectory = null

      if (typeof Number(parantDirectoryParam) == 'number' && !Number.isNaN(Number(parantDirectoryParam))) {
        const id = Number(parantDirectoryParam)
        const directory = await Directories.findByPk(id)

        parentID = parantDirectoryParam
        currentDirectory = directory?.dataValues
      } else if (typeof parantDirectoryParam == 'string') {
        const directory = await Directories.findOne({
          where: { hash: parantDirectoryParam },
          attributes: ['id'],
        })

        parentID = directory.dataValues.id
        currentDirectory = directory?.dataValues
      } else if (!parantDirectoryParam) {
        const directory = await Directories.findOne({ where: { autorHash: user.hash, parrentID: null } })
        currentDirectory = directory?.dataValues
      }

      if (!currentDirectory) return createReponse(NotFoundResponse, { message: 'Не удалось найти директорию' })

      const getParentDirectory = async (directoryID: number | null, order: number = 1) => {
        const directory = await Directories.findByPk(directoryID)
        if (!directory) return []

        const parants = await getParentDirectory(directory.dataValues.parrentID, order + 1)
        parants.push({ ...directory.dataValues, order })

        return parants
      }

      const parents = await getParentDirectory(currentDirectory.parrentID)
      parents.push(currentDirectory)
      const breadcrumbs = parents

      const directoriesModels = await Directories.findAll({ where: { autorHash: user.hash, parrentID: parentID } })
      const filesModel = await DirectoryFiles.findAll({ where: { autorHash: user.hash, parrentID: parentID } })
      const workspacesModels = await Projects.findAll({ where: { autorID: user.id, parantID: parentID } })

      const [directories, files, workspaces] = await Promise.all([
        directoriesModels.map(async (directory) => {
          const directoryCount = await Directories.count({ where: { parrentID: directory.id } })
          const filesCount = await DirectoryFiles.count({ where: { parrentID: directory.id } })
          const workspaceCount = await Projects.count({ where: { parantID: directory.id } })

          const length = directoryCount + filesCount + workspaceCount

          return {
            ...directory.dataValues,
            autor: user.profile,
            length,
            lastUpdated: directory.updatedAt,
            type: 'directory'
          }
        }),
        filesModel.map((file) => {
          return {
            ...file.dataValues,
            autor: user.profile,
            lastUpdated: file.updatedAt,
            type: file.dataValues.type,
          }
        }),
        workspacesModels.map((workspace) => {
          return {
            ...workspace.dataValues,
            type: 'workspace',
            lastUpdated: workspace.updatedAt
          }
        })
      ])

      const catalog = await Promise.all([...directories, ...files, ...workspaces])
      const sortedCatalog = catalog.sort((prev, next) => {
        if (prev.lastUpdated > next.lastUpdated) return +1
        else if (prev.lastUpdated < next.lastUpdated) return -1
        else 0
      })

      return createReponse(OKResponse, {
        catalog: sortedCatalog,
        breadcrumbs,
        currentDirectory,
      })
    } catch (e) {
      return createReponse(ServerErrorResponse, {
        error: new Error(e).message,
        message: 'Ошиюка при получении каталога',
      }, {
        type: 'error',
        message: 'Не удалось получить каталог, попробуйте позже'
      })
    }
  }

}
