const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log("Connection Failed");
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
