const { Like, Comment, User, Post } = require('../db');

const createLike = async (data) => {
    try {
        const { like, user, post } = data;

        const newLike = await Like.create({
            like,
        });

        const userDB = await User.findAll({
            where: { firstName: user }
        });

        const postDB = await Post.findAll({
            where: { title: post }
        });

        newLike.addUser(userDB);
        newLike.addPost(postDB);
        return newLike;

    } catch (error) {
        console.log('ERROR EN createLike', error);
    }
};

const createComment = async (data) => {
    try {
        const { comment, user, post } = data;

        const newComment = await Comment.create({
            comment,
        });

        const userDB = await User.findAll({
            where: { firstName: user }
        });

        const postDB = await Post.findAll({
            where: { title: post }
        });

        newComment.addUser(userDB);
        newComment.addPost(postDB);
        return newComment;

    } catch (error) {
        console.log('ERROR EN createComment', error);
    }
};

// const getReactionDB = async () => {
//     try {
//         return await Reaction.findAll({
//             include: [{ model: User }, { model: Post }],
//         });
//     } catch (error) {
//         console.log("ERROR EN getReactionDB", error);
//     }
// };

module.exports = { createLike, createComment };