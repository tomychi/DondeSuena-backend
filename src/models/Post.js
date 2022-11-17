const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('post', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
        {
            timestamps: false,
        }
    );
};