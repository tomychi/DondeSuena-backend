const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('ticket', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        priceTotal: { // Suma el precio de todas las entradas para el Usuario
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quantity: { // Cantidad de tickets para el Usuario (min1)
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
        {
            timestamps: false,
        }
    );
};