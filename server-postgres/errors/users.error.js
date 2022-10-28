const GlobalError = require('./global.error');

class UsersError extends GlobalError {
    constructor(message, status) {
        super(message);
        this.status = status;
    }

    static userNotFound() {
        throw Error ('User not found');
    }
}


module.exports = UsersError;