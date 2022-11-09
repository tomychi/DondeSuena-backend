const filterEvents = (events, filter) => {
    switch (filter) {
        case 'date':
            // por date y por start
            return events.sort((a, b) => {
                if (a.date > b.date) {
                    return 1;
                }
                if (a.date < b.date) {
                    return -1;
                }
                if (a.start > b.start) {
                    return 1;
                }
                if (a.start < b.start) {
                    return -1;
                }
                return 0;
            });

        case 'price':
            // por price
            console.log('price filter');
            return events.sort((a, b) => {
                if (a.price > b.price) {
                    return 1;
                }
                if (a.price < b.price) {
                    return -1;
                }
                return 0;
            });

        case 'name':
            // por name
            console.log('name filter');
            return events.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });

        default:
            return false;
    }
};

module.exports = {
    filterEvents,
};
