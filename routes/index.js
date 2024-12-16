const Router = require("express");
const router = new Router();
const modelRouter = require("./modelRouter");
const userRouter = require("./userRouter");

router.use("/user", userRouter);
router.use("/models", modelRouter);
// router.use('/mailer',mailerRouter)

module.exports = router;
