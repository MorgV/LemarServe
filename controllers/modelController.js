const { Model } = require("../modules/modules");
const ApiError = require("../error/ApiError");

class ModelController {
  async createModel(req, res) {
    try {
      const { height, shoeSize, gender, FI, age } = req.body;
      const model = await Model.create({ height, shoeSize, gender, FI, age });
      return res.json({ model });
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAll(req, res) {
    const models = await Model.findAll();
    return res.json(models);
  }
}

module.exports = new ModelController();
