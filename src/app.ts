import 'dotenv/config'

import * as fs from 'fs'
import * as path from 'path'

import { NotFoundResponse, ServerErrorResponse } from './data/constants/Responses'
import { Request, Response } from 'express'

import { AppController } from './controllers/app.controller'
import { buildGlobalReposity } from './data/reposity'
import { ConnectionMiddleware } from './middlewares/connect.middleware'
import Container from 'typedi'
import { createExpressServer } from 'routing-controllers'
import { GlobalResponseInterceptor } from './data/interceptors/GlobalResponseInterceptor'
import { OnlineController } from './controllers/online.controller'
import { ProjectController } from './controllers/projects.controller'
import { PromocodesController } from './controllers/promocodes.controller'
import { ServerHeaders } from './data/constants/Server'
import { SocketControllers } from 'socket-controllers'
import { startDataBase } from './data/database'
import { StaticController } from './controllers/static.constroller'
import { TariffController } from './controllers/tariff.controller'
import { TServerMode } from './data/interfaces/server.interfaces'
import { UserController } from './controllers/user.controller'
import { WorkspaceController } from './controllers/workspace.controller'

const startServer = async () => {
  try {
    const port = process.env.PORT
    const socketPort = Number(process.env.SOCKET_PORT)
    const serverMode: TServerMode = process.env.SERVER_MODE as TServerMode || 'development'

    const app = createExpressServer({
      controllers: [
        UserController,
        AppController,
        TariffController,
        ProjectController,
        StaticController,
        PromocodesController,
      ],
      interceptors: [GlobalResponseInterceptor],
      cors: {
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ServerHeaders.join(','),
        exposedHeaders: ServerHeaders.join(','),
        credentials: true,
        optionsSuccessStatus: 200,
      },
      classTransformer: true,
      validation: true,
    })

    const socketServer = new SocketControllers({
      port: socketPort,
      controllers: [OnlineController, WorkspaceController],
      middlewares: [ConnectionMiddleware],
      container: Container,
    })

    socketServer.io._opts.cors = {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: [],
      credentials: true
    }

    await startDataBase({
      HOST: process.env.DB_HOST || 'localhost',
      USER: process.env.DB_USERNAME || 'postgres',
      PASWORD: process.env.DB_PASSWORD || 'root',
      DB: process.env.DB_NAME || 'postgres',
      PORT: Number(process.env.DB_PORT) || 5433,
      MODE: serverMode,
    })

    await buildGlobalReposity()

    app.listen(port)

    app.use('/static/get-file/:directory/:filename', (request: Request, response: Response) => {
      try {
        const filename = request.params.filename
        const directory = request.params.directory
  
        if (directory !== 'files') return response.status(404).json(NotFoundResponse)
  
        return response.sendFile(filename, { root: path.join(__dirname, 'data', 'static', 'files') })
      } catch (e) {
        return response.status(501).json(ServerErrorResponse)
      }
    })

    console.log(`Server Start: Server port ${port}, Socket port - ${socketPort}`)
  } catch (error) {
    console.log('server error: ', error)
    if (error instanceof Error  && process.env.SOCKET_MODE == 'production') {
      const date = new Date().toLocaleString('ru').split(' ').join('-').split(',').join('').split('.').join('').split(':').join('')
      const errorName = error.name.split(' ').join('-').split(',').join('').split('.').join('').split(':').join('')

      const filename = `${date}-${errorName}.txt`

      const logsPath = path.join(__dirname, 'data', 'static', 'logs', filename)

      fs.writeFile(logsPath, error.message, (err) => {
        if (!err) return
        console.log('error on create log file: ', err)
      })
    }
  }
}

startServer()

