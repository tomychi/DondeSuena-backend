const server = require('./src/app.js');
const { conn } = require('./src/db.js');
require('dotenv').config();
const {
    loadUsers,
    loadEvents,
    loadPlaces,
    loadArtists,
    loadGenres,
    loadPosts,
} = require('./src/controllers/loadsDatabase');

const port = process.env.PORT || 3000;
// Syncing all the models at once.
conn.sync({ force: false }).then(async () => {
    loadUsers();
    loadEvents();
    loadArtists();
    loadPlaces();
    loadGenres();
    loadPosts();
    server.listen(port, () => {
        console.log(`servidor corriendo en puerto: ${port}`); // eslint-disable-line no-console
    });
});
