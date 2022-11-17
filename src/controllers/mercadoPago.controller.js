const mercadopago = require("mercadopago");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;
const ruta_local = "http://localhost:3000/home";

const crearOrden = async (req, res) => {
  // TOKEN VENDEDOR = TEST-278149704679461-111714-b31cf592f6bb901fa094f5dd10e62ff2-1241379948
  mercadopago.configure({
    access_token: ACCESS_TOKEN,
  });

  let preference = {
    items: [
      {
        title: "Ticket",
        quantity: 1,
        currency_id: "ARS",
        unit_price: 10,
      },
    ],
    back_urls: {
      success: ruta_local,
      failure: ruta_local,
      pending: ruta_local,
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
