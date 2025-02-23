import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'REST Apis',
  version: '1.0.0',
  description: '',
  tagIndex: 3,
  info: {
    title: 'REST Apis',
    version: '1.0.0',
    description: '',
  },
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {
    // ApiKeyAuth: {
    //   type: 'apiKey',
    //   in: 'header',
    //   name: 'X-API-Key',
    // },
  },
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
