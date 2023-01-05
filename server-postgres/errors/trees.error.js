const GlobalError = require('./global.error');
const CustomError = require('./custom.error');

class TreeError extends GlobalError {
    static TreeInsertError() {
        return new CustomError('Failed to insert trees', 400);
    }
}

module.exports = TreeError;