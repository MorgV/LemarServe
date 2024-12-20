const { Model, ImageList } = require("../modules/modules");
const ApiError = require("../error/ApiError");

class ModelController {
  async createModel(req, res) {
    try {
      const { height, shoeSize, gender, firstName, age, imageList } = req.body;
      console.log(
        height,
        shoeSize,
        gender,
        firstName,
        age,
        imageList,
        "ЗАПРОСЫ ТУУУУУУУУУУУУУУУУТ"
      );
      // создание новой модели
      const model = await Model.create({
        height,
        shoeSize,
        gender,
        FI: firstName,
        age,
      });
      // Создание Images
      [imageList].map(async (URL) => {
        console.log(URL, model.id);
        await ImageList.create({ URL, model_id: model.id });
      });
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

// const User = require("./models/User");

// async function insertUser() {
//   try {
//     // Создание новой строки в таблице users
//     const newUser = await User.create({
//       email: "test@example.com",
//       password: "password123",
//       role: "admin",
//     });

//     console.log("Новый пользователь успешно добавлен:", newUser.toJSON());
//   } catch (error) {
//     console.error("Ошибка при добавлении пользователя:", error);
//   }
// }

// insertUser();
