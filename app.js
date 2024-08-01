const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
module.exports = app;


require("./src/middlewares/index");
require("./src/index");

app.listen(port, () => {
  console.log(`Bootstrap has been completed successfully`);
  console.log(`Server are running on PORT:${port}`);
});
