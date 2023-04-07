const GlobalError = require('./global.error');
const CustomError = require('./custom.error');

class TreeError extends GlobalError {
    static TreeInsertError() {
        return new CustomError('Failed to insert trees', 400, 1000);
    }

    static TreeUpdateError() {
        return new CustomError('Failed to update trees', 400, 1001);
    }

    static TreeDeleteError() {
        return new CustomError('Failed to delete trees', 1002);
    }

    static TreeNotFoundError() {
        return new CustomError('Failed to find tree', 1003);
    }

}

module.exports = TreeError;