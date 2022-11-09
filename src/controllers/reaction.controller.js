const { Reaction, User, Post } = require('../db');

// CREATE REACTION ---------------------------------------------------------------------
const createReaction = async (data) => {
    try {
        const { likes, comments, user, post } = data;

        const objReaction = await Reaction.create(
            {
                likes,
                comments,
            }
        );

        const userDB = await User.findAll({
            where: { nickname: user }
        });

        const postDB = await Post.findAll({
            where: { title: post }
        });

        await objReaction.addUser(userDB);
        await objReaction.addPost(postDB);
        return objReaction;

    } catch (error) {
        console.log('ERROR EN createPost', error);
    }
};

module.exports = { createReaction };