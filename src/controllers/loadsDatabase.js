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
