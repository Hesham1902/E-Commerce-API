const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database connected: ${conn.connection.host}`);
  });
  // .catch((err) => {
  //   console.log(err);
  // });
};

module.exports = dbConnection;
