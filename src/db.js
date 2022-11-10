require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
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
fs.readdirSync(path.join(__dirname, '/models'))
    .filter(
        (file) =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
    )
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, '/models', file)));
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
const { Artist, Post, User, Event, Place, Reaction, Genre, Ticket } = sequelize.models;

// Aca vendrían las relaciones
/*
Artist.hasMany(Post) // Artista muchos post
Post.belongsTo(Artist) // Un Post pertenece a un artista

User.hasMany(Reaction); // Usuario logueado muchas reacciones (likes y comentarios)
Reaction.belongsTo(User); // Una Reacción pertenece a un usuario

Post.hasMany(Reaction); // Post muchas reacciones
Reaction.belongsTo(Post); // Una Reacción pertenece a un post

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

User.belongsToMany(Reaction, { through: "users_reactions" });
Reaction.belongsToMany(User, { through: "users_reactions" });

Post.belongsToMany(Reaction, { through: "posts_reactions" });
Reaction.belongsToMany(Post, { through: "posts_reactions" });

Artist.belongsToMany(Genre, { through: 'artists_genres' });
Genre.belongsToMany(Artist, { through: 'artists_genres' });

Event.belongsToMany(Artist, { through: 'events_artists' });
Artist.belongsToMany(Event, { through: 'events_artists' });

Event.belongsToMany(Place, { through: 'events_places' });
Place.belongsToMany(Event, { through: 'events_places' });

Event.belongsToMany(Ticket, { through: 'events_tickets' });
Ticket.belongsToMany(Event, { through: 'events_tickets' });

User.belongsToMany(Ticket, { through: 'users_tickets' });
Ticket.belongsToMany(User, { through: 'users_tickets' });


module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
