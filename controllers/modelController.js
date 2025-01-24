const { Model, ImageList } = require("../modules/modules");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");

class ModelController {
  async createModel(req, res) {
    console.log("createModelLLLLLLLLLLLLLLLL");

    try {
      const { height, shoeSize, gender, firstName, age, imgCount } = req.body;
      console.log(req.body, req.files);

      if (!imgCount) {
        throw new Error("Не указано количество изображений");
      }

      const { imageProfile } = req.files;

      // Сохраняем изображение профиля
      let imageProfileName = uuid.v4() + ".jpg";
      imageProfile.mv(
        path.resolve(__dirname, "..", "static", imageProfileName)
      );
      console.log("Profile image saved:", imageProfileName);

      // Создаём модель с данными
      const model = await Model.create({
        height,
        shoeSize,
        gender,
        FI: firstName,
        age,
        imageProfile: imageProfileName,
      });

      // Записываем imageProfile в ImageList
      await ImageList.create({ URL: imageProfileName, model_id: model.id });

      // Создание списка изображений (кроме imageProfile)
      for (let i = 0; i < imgCount; i++) {
        const image = req.files[`images[${i}]`];

        if (!image) {
          throw new Error(`Изображение с индексом ${i} не найдено`);
        }

        // Проверяем, не является ли это изображение профилем
        if (image.name === imageProfile.name) {
          console.log(`Пропускаем изображение профиля: ${image.name}`);
          continue; // Пропускаем обработку этого изображения
        }

        let imageName = uuid.v4() + ".jpg";
        image.mv(path.resolve(__dirname, "..", "static", imageName));

        // Сохраняем изображение в базе данных
        await ImageList.create({ URL: imageName, model_id: model.id });
      }

      return res.json({ model });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async addImagesToImageList(files, imgCount, modelId) {
    try {
      for (let i = 0; i < imgCount; i++) {
        const image = files[`images[${i}]`];
        if (!image) {
          throw new Error(`Изображение с индексом ${i} не найдено`);
        }

        let imageName = uuid.v4() + ".jpg";
        image.mv(path.resolve(__dirname, "..", "static", imageName));

        await ImageList.create({ URL: imageName, model_id: modelId });
      }
    } catch (error) {
      throw new Error(`Ошибка при добавлении изображений: ${error.message}`);
    }
  }

  async updateModel(req, res) {
    console.log("UPDATEEEEEEEE");
    try {
      const { id } = req.params; // ID модели, которую нужно обновить
      const {
        height,
        shoeSize,
        gender,
        firstName,
        age,
        imgCount,
        deleteImageIdArray,
      } = req.body;
      console.log(req.files, req.body);
      // console.log(height, shoeSize, gender, firstName, age, imgCount);

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

      console.log(req.files);
      // Обновление фото профиля, если предоставлено
      if (req.files && req.files.imageProfile) {
        const { imageProfile } = req.files;
        let imageProfileName = uuid.v4() + ".jpg";
        imageProfile.mv(
          path.resolve(__dirname, "..", "static", imageProfileName)
        );
        //mb ne rabotaet

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
      } else if (req.body && req.body.imageProfile) {
        const lastPart = path.basename(req.body.imageProfile);
        console.log(lastPart);
        model.imageProfile = lastPart;
      }

      await model.save();

      // Обновление изображений, если предоставлены
      if (deleteImageIdArray) {
        const oldImages = await ImageList.findAll({
          where: { model_id: model.id },
        });
        let deleteImageIdArrayOnServe = JSON.parse(req.body.deleteImageIdArray);
        console.log(deleteImageIdArrayOnServe);
        oldImages.map((el) => {
          deleteImageIdArrayOnServe.map(async (id) => {
            console.log("id:", id);
            if (el.id == id) {
              console.log("el:", el, "el.id:", el.id);
              const imgPath = path.resolve(__dirname, "..", "static", el.URL);
              if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
              }
              await el.destroy();
            }
          });
        });
      }

      if (req.files) {
        for (let i = 0; i < imgCount; i++) {
          const image = req.files[`images[${i}]`];
          if (!image) {
            throw new Error(`Изображение с индексом ${i} не найдено`);
          }

          let imageName = uuid.v4() + ".jpg";
          image.mv(path.resolve(__dirname, "..", "static", imageName));

          await ImageList.create({ URL: imageName, model_id: model.id });
          // await addImagesToImageList(req.files, imgCount, model.id);
        }
      }

      console.log("Update end");
      return res.json({ model });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the model" });
    }
  } //может не работать

  async deleteModel(req, res) {
    const { id } = req.params; // Получаем ID из параметров
    console.log("Attempting to delete model with ID:", id);

    try {
      // Находим модель по ID
      const model = await Model.findByPk(id, {
        include: [
          {
            model: ImageList, // Связываем с ImageList для получения всех связанных изображений
          },
        ],
      });

      if (!model) {
        // Если модель не найдена
        console.warn(`Model with ID ${id} not found.`);
        return res.status(404).json({
          status: "not_found",
          message: "Модель не найдена.",
        });
      }

      // Удаляем изображение профиля из папки static
      if (model.imageProfile) {
        const profilePath = path.resolve(
          __dirname,
          "..",
          "static",
          model.imageProfile
        );
        if (fs.existsSync(profilePath)) {
          fs.unlinkSync(profilePath);
          console.log(`Deleted profile image: ${profilePath}`);
        }
        console.log("profilePath      : ", profilePath);
      }

      // Удаляем все связанные изображения из папки static
      const images = model["image-lists"];
      for (const image of images) {
        const imagePath = path.resolve(__dirname, "..", "static", image.URL);
        console.log("imagePath            : ", imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        }
        await image.destroy(); // Удаляем запись из ImageList
      }

      // Удаляем саму модель
      await model.destroy();

      console.log(`Model with ID ${id} successfully deleted.`);
      return res.status(200).json({
        status: "success",
        message: "Модель и связанные изображения успешно удалены.",
      });
    } catch (error) {
      // Обработка ошибок
      console.error(`Error deleting model with ID ${id}:`, error);
      return res.status(500).json({
        status: "error",
        message: "Ошибка при удалении модели.",
      });
    }
  }

  async getAll(req, res) {
    try {
      const {
        page = 1,
        perPage = 5,
        search = "",
        sortBy = "id",
        sortDirection = "asc",
      } = req.query.params;
      console.log(
        req.query.params,
        page,
        perPage,
        search,
        sortBy,
        sortDirection
      );

      // Формирование условий поиска
      const searchCondition = search
        ? {
            [Op.or]: [
              { FI: { [Op.like]: `%${search}%` } },
              { gender: { [Op.like]: `%${search}%` } },
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

  async getModel(req, res) {
    try {
      const { id } = req.params; // Извлекаем ID модели из параметров запроса.
      console.log(`Получение модели и изображений для ID: ${id}`);

      // Находим модель по ID с включением связанных изображений.
      const model = await Model.findByPk(id, {
        include: [
          {
            model: ImageList, // Указываем связанную модель ImageList
            attributes: ["id", "URL"], // Извлекаем только нужные поля
          },
        ],
      });

      // Если модель не найдена, возвращаем 404.
      if (!model) {
        return res.status(404).json({ message: "Модель не найдена" });
      }

      // Формируем массив изображений.
      const images = model["image-lists"].map((image) => ({
        id: image.id,
        URL: `${process.env.REACT_APP_API_URL}${image.URL}`,
      }));

      // Проверяем значение imageProfile
      const imageProfile = isValidURL(model.imageProfile)
        ? model.imageProfile
        : `${process.env.REACT_APP_API_URL}${model.imageProfile}`;

      // Возвращаем данные модели и изображения.
      return res.status(200).json({
        model: {
          id: model.id,
          height: model.height,
          shoeSize: model.shoeSize,
          gender: model.gender,
          FI: model.FI,
          age: model.age,
          imageProfile, // Используем проверенное значение
        },
        images,
      });
    } catch (error) {
      console.error("Ошибка при получении модели и изображений:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getAllSummary(req, res) {
    const {
      page = 1,
      perPage = 5,
      search = "",
      sortBy = "id",
      sortDirection = "asc",
    } = req.query.params;
    console.log(req.query.params, page, perPage, search, sortBy, sortDirection);
    try {
      // Формирование условий поиска
      const searchCondition = search
        ? {
            [Op.or]: [
              { FI: { [Op.like]: `%${search}%` } },
              { gender: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      // Запрос с использованием Sequelize
      const result = await Model.findAndCountAll({
        where: searchCondition,
        attributes: ["id", "height", "FI", "age", "imageProfile"], // Извлекаем только нужные поля
        order: [[sortBy, sortDirection.toUpperCase()]],
        limit: parseInt(perPage, 10),
        offset: (page - 1) * perPage,
      });

      // Формирование ответа
      res.json({
        total: result.count,
        page: Number(page),
        perPage: Number(perPage),
        models: result.rows, // Только нужные поля
      });
    } catch (error) {
      console.error("Ошибка при получении моделей:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}
// Функция проверки валидности URL
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
module.exports = new ModelController();
