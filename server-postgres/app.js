const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/users.route');
const treesRouter = require('./routes/trees.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/trees', treesRouter);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
