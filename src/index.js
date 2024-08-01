const app = require("../app");

app.get("/", (req, res) => {
  res.send("Hello from backup server");
});

app.use("/db", require("./routes/db/index"));
