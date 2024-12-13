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
  height: { type: DataTypes.STRING, unique: true },
  shoeSize: { type: DataTypes.FLOAT },
  gender: { type: DataTypes.STRING, defaultValue: "Man" },
  FI: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER, defaultValue: 3 },
});
const Image = sequelize.define("image-list", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  model_id: { type: DataTypes.INTEGER, allowNull: false },
});

Model.hasMany(Image, { foreignKey: "model_id" });
Image.belongsTo(Model, { foreignKey: "model_id" });

module.exports = {
  User,
  Model,
  Image,
};
