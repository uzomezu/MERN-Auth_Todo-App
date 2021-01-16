const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateTodoInput(data) {
    let errors = {};

    if(Validator.isEmpty(data.text)) {
        errors.text = `Todo's cannot be empty!`;
    }

    if(!Validator.isLength(data.text, {min: 6, max: 60})) {
        errors.text_length = "Todo's must be longer than 6 chars, shorter than 60 chars";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}