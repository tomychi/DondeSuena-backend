const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('ticket', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        priceTotal: { // Suma el precio de todas las entradas para el Usuario
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    },
        {
            timestamps: false,
        }
    );
};