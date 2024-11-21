const { connect, set, Collection } = require("mongoose");
const { Drug } = require("../models");
require("dotenv").config();

function initDB() {
  set("strictQuery", true);
  set("debug", process.env.MODE === "development");
  connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then((data) => {
      console.log("db connected")
    }).catch((err) => console.log(err.message));
}

module.exports = initDB;
