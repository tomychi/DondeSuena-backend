const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'event',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            start: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            state: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            timestamps: false,
        }
    );
};
