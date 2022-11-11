const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (idToken = '') => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, given_name, family_name } =
        ticket.getPayload();

    return {
        firstName: name,
        nickname: given_name,
        lastName: family_name,
        email,
        image: picture,
    };
};

module.exports = {
    googleVerify,
};
