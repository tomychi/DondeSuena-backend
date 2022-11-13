const isValid = require('date-fns/isValid');

const isDate = (date) => {
    if (!date) {
        return false;
    }
    // la date debe ser mayor a la fecha actual
    const dateNow = new Date();
    const dateEvent = new Date(date);
    if (dateEvent < dateNow) {
        return false;
    }
    return true;
};

const isFormatValid = (date) => {
    // si es un foramto de fecha valido yyyy-mm-dd
    const dateEvent = new Date(date);
    if (isValid(dateEvent)) {
        return true;
    }
    return false;
};

module.exports = { isDate, isFormatValid };
