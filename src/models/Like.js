const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('like', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        like: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
        {
            timestamps: false,
        }
    );
};