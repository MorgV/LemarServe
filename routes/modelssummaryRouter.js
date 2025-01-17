const Router = require("express");
const modelController = require("../controllers/modelController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

// router.post("/");
router.get("/", modelController.getAllSummary);

module.exports = router;
