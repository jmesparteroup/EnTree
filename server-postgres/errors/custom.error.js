class CustomError {
    constructor(message, code) {
        this.code = code;
        this.message = message;
    }
}

module.exports = CustomError;