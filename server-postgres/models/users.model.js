const nanoid = require("nanoid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UsersError = require("../errors/users.error");


class User {
  constructor(data) {
    this.userId = data?.userId || nanoid(32);
    this.username = data?.username;
    this.email = data?.email;
    this.password = data?.password;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.mobileNumber = data?.mobileNumber;
    this.age = data?.age;
    this.role = data?.role || "user";
    this.createdAt = data?.createdAt || Date.now();
    this.updatedAt = Date.now();
  }

  async getNewUserData() {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      password: await this.hashPassword(this.password),
      firstName: this.firstName,
      lastName: this.lastName,
      mobileNumber: this.mobileNumber,
      age: this.age,
      role: this.role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static async loginUser(
		identifier,
		identifierData,
		inputPassword,
		repository,
		errors
	) {

		let data;
		let expiresIn = "1d";
		let message = "Login successful";

		if (identifier === "username") {
			data = await repository.getUserByUsername(identifierData);
		}
		if (identifier === "email") {
			data = await repository.getUserByEmail(identifierData);
		}
		if (identifier === "userId") {
			data = await repository.getUserById(identifierData);
			expiresIn = "15m";
			message = "Identity Confirmed";
		}
		if (!data) {
			throw UsersError.UserNotFound();
		}

		const isPasswordValid = await this.comparePassword(
			inputPassword,
			data.password
		);
		if (!isPasswordValid) {
			throw errors.InvalidPassword();
		}

		console.log("Expires in: ", expiresIn);
		return {
			message: message,
			data: {
				userId: data.userId,
				token: await this.getToken(data.userId, expiresIn),
			},
		};
	}

  static async getToken(userId, expiresIn) {
    return await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
  }


}

module.exports = User;
