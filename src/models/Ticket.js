const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "ticket",
    {
      id: {
        // type: DataTypes.UUID,
        // defaultValue: DataTypes.UUIDV4,
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      priceTotal: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
