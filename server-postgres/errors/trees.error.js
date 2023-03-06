const GlobalError = require('./global.error');
const CustomError = require('./custom.error');

class TreeError extends GlobalError {
    static TreeInsertError() {
        return new CustomError('Failed to insert trees', 400);
    }

    static TreeUpdateError() {
        return new CustomError('Failed to update trees', 400);
    }

    static TreeDeleteError() {
        return new CustomError('Failed to delete trees', 400);
    }

    static TreeNotFoundError() {
        return new CustomError('Failed to find tree', 400);
    }

}

module.exports = TreeError;