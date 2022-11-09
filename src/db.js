require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dondesuena`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Artist, Post, User, Reaction, Genre, Ticket } = sequelize.models;

// Aca vendrían las relaciones
/*
User.hasMany(Reaction); // Un usuario logueado puede generar muchas reacciones (likes y comentarios)
Reaction.belongsTo(User); // Una reacción pertenece a un usuario

Post.hasMany(Reaction); // Un post puede tener muchas reacciones
Reaction.belongsTo(Post); // Una reacción pertenece a un post
*/

// Probemos...
Artist.belongsToMany(Post, { through: "artists_posts" });
Post.belongsToMany(Artist, { through: "artists_posts" });

User.belongsToMany(Reaction, { through: "users_reactions" });
Reaction.belongsToMany(User, { through: "users_reactions" });

Post.belongsToMany(Reaction, { through: "posts_reactions" });
Reaction.belongsToMany(Post, { through: "posts_reactions" });

Artist.belongsToMany(Genre, { through: "artists_genres" });
Genre.belongsToMany(Artist, { through: "artists_genres" });

const { Event, Place } = sequelize.models;

User.hasMany(Ticket); // Un usuario puede tener muchos tickets
Ticket.belongsTo(User); // Un ticket le pertenece a un usuario 

Event.hasMany(Ticket); // Un evento puede tener muchos tickets
Ticket.belongsTo(Event); // Un ticket pertenece a un evento

Event.belongsTo(Place); // Un evento pertenece a un lugar
Place.hasMany(Event); // Un lugar tiene muchos eventos

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
