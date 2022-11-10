const { Reaction, User, Post } = require('../db');

// CREATE REACTION ---------------------------------------------------------------------
const createReaction = async (data) => {
    try {
        const { likes, comments, user, post } = data;

        const newReaction = await Reaction.create({
            likes,
            comments,
        });

        const userDB = await User.findAll({
            where: { nickname: user }
        });

        const postDB = await Post.findAll({
            where: { title: post }
        });

        newReaction.addUser(userDB);
        newReaction.addPost(postDB);
        return newReaction;

    } catch (error) {
        console.log('ERROR EN createPost', error);
    }
};

const getReactionDB = async () => {
    try {
        return await Reaction.findAll({
            include: [{ model: User }, { model: Post }],
        });
    } catch (error) {
        console.log("ERROR EN getReactionDB", error);
    }
};

module.exports = { createReaction, getReactionDB };