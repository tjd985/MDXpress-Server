const mongoose = require("mongoose");

const CONFIG = require("../constants/config");

async function mongooseLoader() {
  try {
    await mongoose.connect(CONFIG.MONGODB_ENDPOINT, {
      DBName: "MDXpress",
    });
    mongoose.set("autoIndex", true);

    console.log("connected to database");
  } catch (error) {
    console.error(error);
  }
}

module.exports = mongooseLoader;
