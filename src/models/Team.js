const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("team", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tittle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    urlGithub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    urlLinkedin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iconGithub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iconLinkedin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
