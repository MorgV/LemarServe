const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "ADMIN" },
});
const Model = sequelize.define("model", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  height: { type: DataTypes.INTEGER },
  shoeSize: { type: DataTypes.FLOAT },
  gender: { type: DataTypes.STRING, defaultValue: "Man" },
  FI: { type: DataTypes.STRING, unique: true },
  age: { type: DataTypes.INTEGER, defaultValue: 3 },
  imageProfile: { type: DataTypes.STRING },
});
const ImageList = sequelize.define("image-list", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  URL: { type: DataTypes.STRING },
  model_id: { type: DataTypes.INTEGER, allowNull: false },
});

Model.hasMany(ImageList, { foreignKey: "model_id" });
ImageList.belongsTo(Model, { foreignKey: "model_id" });

module.exports = {
  User,
  Model,
  ImageList,
};
