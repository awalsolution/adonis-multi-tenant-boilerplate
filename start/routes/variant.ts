import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const VariantController = () => import('#controllers/variant_controller')

router
  .group(() => {
    router.get('/customer', [VariantController, 'findAllRecords'])
    router.get('/customer/:id', [VariantController, 'findSingleRecord'])
    router.get('/customer/findBy/:id', [VariantController, 'getVariantsByProduct'])
    router
      .group(() => {
        router.get('/', [VariantController, 'findAllRecords'])
        router.get('/:id', [VariantController, 'findSingleRecord'])
        router.get('/findBy/:id', [VariantController, 'getVariantsByProduct'])
        router.post('/:id', [VariantController, 'create'])
        router.put('/:id', [VariantController, 'update'])
        router.put('/status/:id', [VariantController, 'updateStatus'])
        router.delete('/:id', [VariantController, 'destroy'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('/api/v1/variant')
