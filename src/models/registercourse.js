'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegisterCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegisterCourse.init({
    idUser: DataTypes.INTEGER,
    idCourse: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RegisterCourse',
  });
  return RegisterCourse;
};