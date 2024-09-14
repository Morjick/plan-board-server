
import { IApiHTTPMethod, ISocketNameSpace, IUnionType } from '../interfaces/docs.interfaces'
import { analyticsMethods } from './methods/analytics'
import { appMethods } from './methods/app'
import { onlineNameSpace } from './namespaces/online'
import { projectsMethods } from './methods/projects'
import { tariffMethods } from './methods/tariffs'
import { unionTypes } from './types.doc'
import { userMethods } from './methods/user'
import { workspaceNameSpace } from './namespaces/workspace'

export const methods: IApiHTTPMethod[] = [...userMethods, ...appMethods, ...tariffMethods, ...projectsMethods, ...analyticsMethods]

export const namespaces: ISocketNameSpace[] = [workspaceNameSpace, onlineNameSpace]

export const types: IUnionType[] = unionTypes

