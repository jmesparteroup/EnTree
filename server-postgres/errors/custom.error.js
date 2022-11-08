class CustomError {
    constructor(code, message, customCode) {
        this.code = code;
        this.message = message;
        this.customCode = customCode;
    }
}

module.exports = CustomError;