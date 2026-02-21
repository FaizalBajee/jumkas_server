const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const authRouter = require("./src/routers/authRouter");
const productsRouter = require("./src/routers/productsRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));

app.get("/test", (req, res) => {
  res.json("Welcome to Jumkas API");
})

const url = "mongodb://localhost:27017";
const dbName = "jumkasDB";

MongoClient.connect(url)
  .then((client) => {
    console.log("✅ connected to mongodb");
    app.locals.db = client.db(dbName);
  })
  .catch((err) => {
    console.log(`❌ connection failed : ${err}`);
  });


app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.use("", (req, res) => {
  res.json("404 Not Found-");
});

app.listen(8010, () => {
  console.log("Running...");
});
