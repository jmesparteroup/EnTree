class CustomError {
    constructor(message, code, customCode) {
        this.code = code;
        this.customCode = customCode || 5000;
        this.message = message;
    }
}

module.exports = CustomError;