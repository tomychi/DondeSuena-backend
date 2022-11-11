const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('reaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        comments: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
        }
    },
        {
            timestamps: false,
        }
    );
};