const mongoose = require("mongoose");

module.exports.connectDB = async () => {
  //   try {
  await mongoose
    .connect(
      process.env.MONGODB_URL
    )
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));
};
