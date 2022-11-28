const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('comment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        parent: {
            type: DataTypes.INTEGER,
            defaultValue: null,
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