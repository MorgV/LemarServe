const Router = require("express");
const router = new Router();
const modelController = require("../controllers/modelController");
const checkRole = require("../middleware/checkRoleMiddleware");

// router.post('/',checkRole('ADMIN'),modelController.create)
router.post("/", modelController.createModel);
router.get("/", modelController.getAll);
router.get("/:id", modelController.getOne);
router.post("/:id", modelController.updateModel);
module.exports = router;
