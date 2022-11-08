const { Post, Artist } = require('../db');

// CREATE POST ---------------------------------------------------------------------
const createPosts = async (data) => { 
    try {
        const { title, description, image, likes, comments, artists } = data;
        
        const objPost = await Post.create(
            {
                title,
                description,
                image,
                likes,
                comments,
            }
        );
        
        const artistsDB = await Artist.findAll({
            where: { name: artists }
        });

        let newPost = objPost.addType(artistsDB);
        return newPost;

    } catch (error) {
        console.log('ERROR EN createPost', error);
    }
};

module.exports = { createPosts };