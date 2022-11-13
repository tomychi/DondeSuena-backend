const isValid = require('date-fns/isValid');

const isDate = (value) => {
    // debe ser un formato de fecha valido
    console.log('first', value);
    if (!isValid(new Date(value))) {
        return false;
    }

    return true;
};

module.exports = isDate;
