require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;
// const sequelize = new Sequelize(
//   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dondesuena`,
//   {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//   }
// );
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dondesuena`,
        { logging: false, native: false }
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
const {
  Artist,
  User,
  Event,
  Place,
  Genre,
  Post,
  Like,
  Comment,
  Response,
  Ticket,
  Favorite,
} = sequelize.models;

// Aca vendrían las relaciones
/*
Artist.hasMany(Post) // Artista muchos post
Post.belongsTo(Artist) // Un Post pertenece a un artista

User.hasMany(Like); // Usuario logueado muchos likes
Like.belongsTo(User); // Un Like pertenece a un usuario

User.hasMany(Comment); // Usuario logueado muchos comentarios
Comment.belongsTo(User); // Un Comentario pertenece a un usuario

Post.hasMany(Like); // Post muchos likes
Like.belongsTo(Post); // Un Like pertenece a un post

Post.hasMany(Comment); // Post muchos comentarios
Comment.belongsTo(Post); // Un Comentario pertenece a un post

Place.hasMany(Event); // Lugar muchos eventos
Event.belongTo(Place); // Un Evento pertenece a un lugar

Event.hasMany(Ticket); // Evento muchos tickets
Ticket.belongsTo(Event); // Un Ticket pertenece a un evento

User.hasMany(Ticket); // Usuario muchos tickets
Ticket.belongTo(User); // Un Ticket pertenece a un usuario 
*/

// Probemos...
Artist.belongsToMany(Post, { through: "artists_posts" });
Post.belongsToMany(Artist, { through: "artists_posts" });

User.belongsToMany(Like, { through: "users_likes" });
Like.belongsToMany(User, { through: "users_likes" });

Artist.belongsToMany(Like, { through: "artists_likes" });
Like.belongsToMany(Artist, { through: "artists_likes" });

User.belongsToMany(Comment, { through: "users_comments" });
Comment.belongsToMany(User, { through: "users_comments" });

Artist.belongsToMany(Comment, { through: "artists_comments" });
Comment.belongsToMany(Artist, { through: "artists_comments" });

Post.belongsToMany(Like, { through: "posts_likes" });
Like.belongsToMany(Post, { through: "posts_likes" });

Post.belongsToMany(Comment, { through: "posts_comments" });
Comment.belongsToMany(Post, { through: "posts_comments" });

User.belongsToMany(Response, { through: "users_responses" });
Response.belongsToMany(User, { through: "users_responses" });

Artist.belongsToMany(Response, { through: "artists_responses" });
Response.belongsToMany(Artist, { through: "artists_responses" });

Comment.belongsToMany(Response, { through: "comments_responses" });
Response.belongsToMany(Comment, { through: "comments_responses" });

Artist.belongsToMany(Genre, { through: "artists_genres" });
Genre.belongsToMany(Artist, { through: "artists_genres" });

Event.belongsToMany(Artist, { through: "events_artists" });
Artist.belongsToMany(Event, { through: "events_artists" });

Event.belongsToMany(Genre, { through: "events_genres" });
Genre.belongsToMany(Event, { through: "events_genres" });

Event.belongsToMany(Place, { through: "events_places" });
Place.belongsToMany(Event, { through: "events_places" });

Event.belongsToMany(Ticket, { through: "events_tickets" });
Ticket.belongsToMany(Event, { through: "events_tickets" });

User.belongsToMany(Ticket, { through: "users_tickets" });
Ticket.belongsToMany(User, { through: "users_tickets" });

User.belongsToMany(Favorite, { through: "users_favorites" });
Favorite.belongsToMany(User, { through: "users_favorites" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
