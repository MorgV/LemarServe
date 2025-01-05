const { Model, ImageList } = require("../modules/modules");
const uuid = require("uuid");
const path = require("path");

const { message } = require("statuses");
const { Op } = require("sequelize");

class ModelController {
  async createModel(req, res) {
    try {
      const { height, shoeSize, gender, firstName, age, imgCount } = req.body;

      const { imageProfile } = req.files;
      let imageProfileName = uuid.v4() + ".jpg";
      imageProfile.mv(
        path.resolve(__dirname, "..", "static", imageProfileName)
      );
      console.log(imageProfile, imageProfileName);
      const model = await Model.create({
        height,
        shoeSize,
        gender,
        FI: firstName,
        age,
        imageProfile: imageProfileName,
      });
      // Создание Images

      for (let i = 0; i < imgCount; i++) {
        const image = req.files[`images[${i}]`];
        let imageName = uuid.v4() + ".jpg";
        image.mv(path.resolve(__dirname, "..", "static", imageName));

        let imgPath = req.files[`images[${i}]`].filename;
        await ImageList.create({ URL: imageName, model_id: model.id });
      }

      return res.json({ model });
    } catch (error) {
      console.log(error.message);
    }
  }
  async updateModel(req, res) {
    try {
      const { id } = req.params; // ID модели, которую нужно обновить
      const { height, shoeSize, gender, firstName, age, imgCount } = req.body;

      // Поиск модели по ID
      const model = await Model.findByPk(id);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      // Обновление основных данных модели
      if (height !== undefined) model.height = height;
      if (shoeSize !== undefined) model.shoeSize = shoeSize;
      if (gender !== undefined) model.gender = gender;
      if (firstName !== undefined) model.FI = firstName;
      if (age !== undefined) model.age = age;

      // Обновление фото профиля, если предоставлено
      if (req.files && req.files.imageProfile) {
        const { imageProfile } = req.files;
        let imageProfileName = uuid.v4() + ".jpg";
        imageProfile.mv(
          path.resolve(__dirname, "..", "static", imageProfileName)
        );

        // Удалить старый файл профиля, если требуется
        const oldProfilePath = path.resolve(
          __dirname,
          "..",
          "static",
          model.imageProfile
        );
        if (fs.existsSync(oldProfilePath)) {
          fs.unlinkSync(oldProfilePath);
        }

        model.imageProfile = imageProfileName;
      }

      await model.save();

      // Обновление изображений, если предоставлены
      if (imgCount) {
        // Удаляем старые изображения модели из базы данных и файловой системы
        const oldImages = await ImageList.findAll({
          where: { model_id: model.id },
        });
        for (const img of oldImages) {
          const imgPath = path.resolve(__dirname, "..", "static", img.URL);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
          await img.destroy();
        }

        // Добавляем новые изображения
        for (let i = 0; i < imgCount; i++) {
          const image = req.files[`images[${i}]`];
          let imageName = uuid.v4() + ".jpg";
          image.mv(path.resolve(__dirname, "..", "static", imageName));
          await ImageList.create({ URL: imageName, model_id: model.id });
        }
      }

      return res.json({ model });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the model" });
    }
  } //может не работать

  async getAll(req, res) {
    const {
      page = 1,
      perPage = 5,
      search = "",
      sortBy = "id",
      sortDirection = "asc",
    } = req.query.params;
    console.log(req.query.params);
    try {
      // Формирование условий поиска
      const searchCondition = search
        ? {
            [Op.or]: [
              { FI: { [Op.like]: `%${search}%` } },
              { gender: { [Op.like]: `%${search}%` } },
              // { shoeSize: { [Op.like]: `%${search}%` } },
              // { height: { [Op.like]: `%${search}%` } },
              // { age: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      // Запрос с использованием Sequelize
      const result = await Model.findAndCountAll({
        where: searchCondition,
        order: [[sortBy, sortDirection.toUpperCase()]],
        limit: parseInt(perPage),
        offset: (page - 1) * perPage,
      });

      // Формирование ответа
      res.json({
        total: result.count,
        page: Number(page),
        perPage: Number(perPage),
        models: result.rows,
      });
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      console.log("afssssssssssssssssssssssssssssssss");
      const record = await Model.findOne({
        where: {
          id: id,
        },
      });

      return record ? res.json(record) : null;
    } catch (error) {
      console.error("Error finding record:", error);
    }
  } //может не работать
}
module.exports = new ModelController();
