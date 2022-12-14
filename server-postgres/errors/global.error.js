const CustomError = require('./custom.error');


class GlobalError {

    static genericError(message, code) {
        return new CustomError(message, code);
    }

    static badRequest(message) {
        return new CustomError(message, 400);
    }

    static notFound(message) {
        return new CustomError(message, 404);
    }

}

module.exports = GlobalError;