const Router = require('express')
const  deviceTableController = require('../controllers/deviceController')
const router = new Router()
// const typeController = require('../controllers/deviceController')
// const checkRole =require('../middleware/checkRoleMiddleware')

router.get('/', deviceTableController.getTable)


module.exports = router    
