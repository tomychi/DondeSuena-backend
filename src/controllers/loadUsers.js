const { User } = require('../db');
const { faker } = require('@faker-js/faker');
const loadUsers = async () => {
    try {
        const users = await User.findAll();
        if (users.length === 0) {
            const users = [];
            for (let i = 0; i < 10; i++) {
                users.push({
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    birthday: faker.date.past(),
                    phone: faker.phone.number(),
                    nickname: faker.internet.userName(),
                    image: faker.image.avatar(),
                });
            }
            await User.bulkCreate(users);
            console.log('Users creados!');
        } else {
            console.log('Users no creados!');
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { loadUsers };
