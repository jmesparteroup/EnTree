const GlobalError = require('./global.error');
const CustomError = require('./custom.error');

class UsersError extends GlobalError {
    static UserNotFound() {
        return new CustomError('User not found', 404, 1001);
    }

    static UserAlreadyExists() {
        return new CustomError('Username already exists', 409, 1002);
    }

    static EmailAlreadyExists() {
        return new CustomError('Email already exists', 409, 1003);
    }

    static EmailDoesNotExist() {
        return new CustomError('Email does not exist', 400, 1004);
    }

    static IncorrectPassword() {
        return new CustomError('Incorrect password', 400, 1005);
    }

    static InvalidLoginType() {
        return new CustomError('Invalid login type', 400, 1006);
    }
    static InvalidCredentials() {
        return new CustomError('Invalid credentials', 401, 1007);
    }
    static SQLQueryError() {
        return new CustomError("Error saving to Database.", 500, 4);
    }

}


module.exports = UsersError;