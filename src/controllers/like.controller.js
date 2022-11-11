const { Like, User, Post } = require('../db');

const createLike = async (data) => {
    try {
        const { like, user, post } = data;

        const newLike = await Like.create({
            like,
        });

        const userDB = await User.findAll({
            where: { nickname: user }
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

// const getReactionDB = async () => {
//     try {
//         return await Reaction.findAll({
//             include: [{ model: User }, { model: Post }],
//         });
//     } catch (error) {
//         console.log("ERROR EN getReactionDB", error);
//     }
// };

module.exports = { createLike };