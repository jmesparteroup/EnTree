const GlobalError = require('./global.error');
const CustomError = require('./custom.error');

class UsersError extends GlobalError {
    static UserNotFound() {
        return new CustomError('User not found', 404);
    }

    static UserAlreadyExists() {
        return new CustomError('User already exists', 409);
    }

    static InvalidCredentials() {
        return new CustomError('Invalid credentials', 401);
    }

    static InvalidEmail() {
        return new CustomError('Invalid email', 400);
    }

    static InvalidPassword() {
        return new CustomError('Invalid password', 400);
    }

}


module.exports = UsersError;