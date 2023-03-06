// JWT MIDDLEWARE
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy,
	ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};
const pool = require("../config/database");

const getUser = async function (userId) {
    try {
        const user = await pool.query(
            `SELECT * FROM users WHERE "userId" = $1`,
            [userId]
        );
        return user.rows[0];
    } catch (error) {
        console.log(error);
    }
};

passport.use(
	new JwtStrategy(opts, function (jwt_payload, done) {
		console.log(jwt_payload);
		getUser(jwt_payload.userId)
			.then((user) => {
				if (user) {
					return done(null, user);
				}
				return done(null, false);
			})
			.catch((err) => {
				console.log(err);
				return done(err, false);
			});
	})
);

const authenticationWhiteList = [""];

module.exports = (req, res, next) => {
	let route = `${req.method} ${req.baseUrl}`;
	console.log(`${route}`);

	if (authenticationWhiteList.indexOf(route) !== -1) return next();

	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) {
			return res.status(500).json({ message: "Something went wrong" });
		}
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		req.user = user;
		next();
	})(req, res, next);
};
