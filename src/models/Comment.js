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