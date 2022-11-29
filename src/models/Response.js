const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('response', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
        {
            timestamps: false,
        }
    );
};