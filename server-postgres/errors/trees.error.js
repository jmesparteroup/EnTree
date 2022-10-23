const GlobalError = require('./global.error');

class TreeError extends GlobalError {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

module.exports = TreeError;