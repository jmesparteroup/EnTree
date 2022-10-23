class GlobalError {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }

    static genericError(message, code) {
        return new Error(message, code);
    }

    static badRequest(message) {
        return new Error(message, 400);
    }

    static notFound(message) {
        return new Error(message, 404);
    }

}

module.exports = GlobalError;