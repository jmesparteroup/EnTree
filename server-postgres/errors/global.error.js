const CustomError = require('./custom.error');


class GlobalError {

    static genericError(message, code) {
        return new CustomError(message, code);
    }

    static badRequest(message) {
        return new CustomError(message, 400, 1);
    }

    static notFound(message) {
        return new CustomError(message, 404, 2);
    }

    static Unauthorized(message) {
        return new CustomError(message, 401, 3);
    }

    static SQLQueryError() {
        return new CustomError("Error saving to Database.", 500, 4);
    }

}

module.exports = GlobalError;