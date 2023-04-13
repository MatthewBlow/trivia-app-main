const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5001", "http://localhost:3001"],
  })
);

app.post("/save", (req, res) => {
  let data = [];
  if (fs.existsSync("database.json")) {
    data = JSON.parse(fs.readFileSync("database.json"));
  }

  const newData = req.body;
  newData.created_at = Date.now();
  data.push(newData);

  fs.writeFileSync("database.json", JSON.stringify(data));
  res.send("Data saved to database.json");
});

app.listen(5001, () => {
  console.log("Server started on http://localhost:5001");
});
