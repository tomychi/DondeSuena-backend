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
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            start: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            end: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quotas: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            genre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },

        {
            timestamps: false,
        }
    );
};
