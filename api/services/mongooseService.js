const mongoose = require("mongoose");

const databaseConnection = async () => {
  return await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  });
};

//import our modeles here
const models = {};

//exports our connection and a models object for reuse
module.exports = { databaseConnection, models };
