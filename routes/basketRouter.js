const Router = require('express')
const  basketController = require('../controllers/basketController')
const router = new Router()
// const typeController = require('../controllers/deviceController')
// const checkRole =require('../middleware/checkRoleMiddleware')

router.get('/', basketController.getAll)
router.get('/:id', basketController.deleteOne)
router.post('/', basketController.AddToBasket)
router.post('/:id', basketController.updateCount)

module.exports = router    
