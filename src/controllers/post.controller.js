const { Post, Artist, Reaction } = require('../db');

//ruta modularizada -> /post

// CREATE POST ---------------------------------------------------------------------
const createPosts = async (data) => {
    try {
        const { title, description, image, artists } = data;

        const newPost = await Post.create({
            title,
            description,
            image,
        });

        const artistsDB = await Artist.findAll({
            where: { nickname: artists }
        });

        newPost.addArtist(artistsDB);
        return newPost;

    } catch (error) {
        console.log('ERROR EN createPost', error);
    }
};

const getPostDB = async () => {
    try {
        return await Post.findAll({
            include: [{ model: Artist }, { model: Reaction }],
        });
    } catch (error) {
        console.log("ERROR EN getReactionDB", error);
    }
};

module.exports = { createPosts, getPostDB };