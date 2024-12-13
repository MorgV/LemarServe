const Router = require('express')
const  orderController = require('../controllers/orderController')
const router = new Router()

// router.get('/', mailerController.mailerController)
// router.get('/:id', mailerController.deleteOne)
router.get('/', orderController.getAll)
router.get('/:id', orderController.getOne)
router.post('/', orderController.create)

// router.get('/:id', orderController.getOne)

// router.post('/:id', basketController.updateCount)

module.exports = router    