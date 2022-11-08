const { User } = require('../db');
const { Event } = require('../db');
const { Place } = require('../db');
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

const loadEvents = async () => {
    try {
        const events = await Event.findAll();
        if (events.length === 0) {
            const events = [];
            for (let i = 0; i < 10; i++) {
                events.push({
                    name: faker.name.firstName(),
                    description: faker.name.jobDescriptor(),
                    date: faker.date.past(),
                    start: faker.date.recent(),
                    end: faker.date.recent(),
                    price: faker.finance.amount(),
                    quantity: faker.random.numeric(),
                    // userId: faker.random.alphaNumeric(),
                    // placeId: faker.random.alphaNumeric(),
                });
            }
            await Event.bulkCreate(events);
            console.log('Events creados!');
        } else {
            console.log('Events no creados!');
        }
    } catch (error) {
        console.log(error);
    }
};

const loadPlaces = async () => {
    try {
        const places = await Place.findAll();
        if (places.length === 0) {
            const places = [];
            for (let i = 0; i < 10; i++) {
                places.push({
                    name: faker.name.firstName(),
                    address: faker.address.streetAddress(),
                    city: faker.address.city(),
                    postCode: faker.address.zipCode(),
                    phone: faker.phone.number(),
                    email: faker.internet.email(),
                    image: faker.image.business(),
                });
            }
            await Place.bulkCreate(places);
            console.log('Places creados!');
        } else {
            console.log('Places no creados!');
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { loadUsers, loadEvents, loadPlaces };
