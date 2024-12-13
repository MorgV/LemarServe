const Router = require('express')
const  mailerController = require('../controllers/mailerController')
const router = new Router()

// router.get('/', mailerController.mailerController)
// router.get('/:id', mailerController.deleteOne)
router.post('/', mailerController.sendMessage)
router.get('/', mailerController.generateСode)

// router.post('/:id', basketController.updateCount)

module.exports = router    