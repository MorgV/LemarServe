const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')
const deviceTableRouter = require('./deviceTableRouter')
const basketRouter = require('./basketRouter')
const mailerRouter = require('./mailerRouter')
const ordersRouter = require('./ordersRouter')



router.use('/user',userRouter)
router.use('/type',typeRouter)
router.use('/brand',brandRouter)
router.use('/device',deviceRouter)
router.use('/deviceTable',deviceTableRouter)
router.use('/basket',basketRouter)
router.use('/mailer',mailerRouter)
router.use('/orders',ordersRouter)


module.exports = router;