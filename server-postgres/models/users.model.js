const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

class User {
  constructor(data) {
    this.userId = data?.userId || nanoid(32);
    this.email = data?.email;
    this.password = data?.password;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.mobileNumber = data?.mobileNumber;
    this.age = data?.age;
    this.role = data?.role || "user";
    this.createdAt = data?.createdAt
    this.updatedAt = Date.now();
  }

    generateCreateUserData(){
        return {
            userId: this.userId,
            email: this.email,
            password: this.constructor.hashPassword(this.password),
            firstName: this.firstName,
            lastName: this.lastName,
            mobileNumber: this.mobileNumber,
            age: this.age,
            role: this.role,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
    }

    hashPassword(password) {
		return bcrypt.hash(password, 10);
	}

	comparePassword(password, hash) {
		return bcrypt.compare(password, hash);
	}



}

module.exports = User;