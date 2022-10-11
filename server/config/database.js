const mongoose = require("mongoose");

module.exports = mongoose
  .connect("mongodb://mongo:27017/scans", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB server"))
  .catch((error) => console.log(error));
