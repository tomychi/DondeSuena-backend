const { User } = require('../db');
const { Event } = require('../db');
const { Place } = require('../db');
const { Artist } = require('../db');
const { Genre } = require('../db');
const { Post } = require('../db');
const path = require('path');
const fs = require('fs');
/* 
cargar todos los datos en un json

fs.writeFileSync(
    path.join(__dirname, '../database/Genres.json'),
    JSON.stringify(listGenres)
);

*/

const loadUsers = async () => {
    // leemos los usuarios del Users.json

    try {
        // si ya hay usuarios en la base de datos, no cargar nada
        const users2 = await User.findAll();
        if (users2.length) {
            console.log('ya hay usuarios');
            return;
        }

        const users = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../database/Users.json'))
        );
        await User.bulkCreate(users);
        console.log('usuarios cargados');
    } catch (error) {
        console.log(error);
    }
};

const loadEvents = async () => {
    // leemos los eventos del Events.json

    try {
        // si ya hay eventos en la base de datos, no cargar nada
        const events2 = await Event.findAll();
        if (events2.length) {
            console.log('ya hay eventos');
            return;
        }
        const events = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../database/Events.json'))
        );
        await Event.bulkCreate(events);
        console.log('eventos cargados');
    } catch (error) {
        console.log(error);
    }
};

const loadPlaces = async () => {
    // leemos los lugares del Places.json

    try {
        // si ya hay lugares en la base de datos, no cargar nada
        const places2 = await Place.findAll();
        if (places2.length) {
            console.log('ya hay lugares');
            return;
        }

        const places = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../database/Places.json'))
        );
        await Place.bulkCreate(places);
        console.log('lugares cargados');
    } catch (error) {
        console.log(error);
    }
};

const loadArtists = async () => {
    // leemos los artistas del Artists.json

    try {
        // si ya hay artistas en la base de datos, no cargar nada
        const artists2 = await Artist.findAll();
        if (artists2.length) {
            console.log('ya hay artistas');
            return;
        }

        const artists = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../database/Artists.json'))
        );
        await Artist.bulkCreate(artists);
        console.log('artistas cargados');
    } catch (error) {
        console.log(error);
    }
};

const loadGenres = async () => {
    // leemos los generos del Genres.json

    try {
        // si ya hay generos en la base de datos, no cargar nada
        const genres2 = await Genre.findAll();
        if (genres2.length) {
            console.log('ya hay generos');
            return;
        }
        const genres = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../database/Genres.json'))
        );
        await Genre.bulkCreate(genres);
        console.log('generos cargados');
    } catch (error) {
        console.log(error);
    }
};

const loadPosts = async () => {
    // leemos los posts del Posts.json

    try {
        // si ya hay posts en la base de datos, no cargar nada
        const posts2 = await Post.findAll();
        if (posts2.length) {
            console.log('ya hay posts');
            return;
        }

        const posts = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../database/Posts.json'))
        );
        await Post.bulkCreate(posts);
        console.log('posts cargados');
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    loadUsers,
    loadEvents,
    loadPlaces,
    loadArtists,
    loadGenres,
    loadPosts,
};
