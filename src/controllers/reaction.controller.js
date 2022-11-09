const { Reaction, User } = require('../db');

// CREATE REACTION ---------------------------------------------------------------------
const createReaction = async (data) => {
    try {
        const { likes, comments, user } = data;

        const objReaction = await Reaction.create(
            {
                likes,
                comments,
            }
        );

        const userDB = await User.findAll({
            where: { name: user }
        });

        let newReaction = objReaction.addUser(userDB);
        return newReaction;

    } catch (error) {
        console.log('ERROR EN createPost', error);
    }
};

module.exports = { createReaction };