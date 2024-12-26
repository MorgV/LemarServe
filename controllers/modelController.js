const { Model, ImageList } = require("../modules/modules");
const uuid = require("uuid");
const path = require("path");

const { message } = require("statuses");

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

  async getAll(req, res) {
    //
    const models = await Model.findAll();
    return res.json(models);
  }

  async uploudFile(req, res) {
    try {
      const file = req.files.file;
      console.log(file);
      // const parent = await ImageList.findOne()
    } catch (error) {
      return res.status(500).json({ message: "Upload error" });
    }
  }
}

module.exports = new ModelController();
