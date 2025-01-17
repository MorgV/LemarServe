const Router = require("express");
const router = new Router();
const modelRouter = require("./modelRouter");
const userRouter = require("./userRouter");
const modelssummaryRouter = require("./modelssummaryRouter");

router.use("/user", userRouter);
router.use("/models", modelRouter);
router.use("/modelssummary", modelssummaryRouter);
// router.use('/mailer',mailerRouter)

module.exports = router;
