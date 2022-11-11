const { Post, Artist } = require('../db');

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

module.exports = { createPosts };