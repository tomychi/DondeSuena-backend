const { Comment, User, Post } = require('../db');

const createComment = async (data) => {
    try {
        const { comment, user, post } = data;

        const newComment = await Comment.create({
            comment,
        });

        const userDB = await User.findAll({
            where: { nickname: user }
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

module.exports = { createComment };