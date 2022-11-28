const mercadopago = require("mercadopago");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;
const ruta_local = process.env.FRONT_URL || "http://localhost:3000/details/";

const crearOrden = async (req, res) => {
  const { quantity, priceTotal, id } = req.body;

  mercadopago.configure({
    access_token: ACCESS_TOKEN,
  });

  let preference = {
    items: [
      {
        title: "Tickets",
        quantity: quantity,
        currency_id: "ARS",
        unit_price: priceTotal,
      },
    ],
    back_urls: {
      success: `${ruta_local}${id}?purchasedQuantity=${quantity}`,
      failure: `${ruta_local}${id}?purchasedQuantity=${quantity}`,
      pending: `${ruta_local}${id}`,
    },
    auto_return: "approved",
    payment_methods: {
      installments: 1,
    },
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => {
      res.json(response.body.init_point);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  crearOrden,
};
