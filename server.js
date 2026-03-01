const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient } = require("mongodb");
const authRouter = require("./src/routers/authRouter");
const productsRouter = require("./src/routers/productsRouter");

const app = express();

app.use(
  cors({
    origin: true, // reflect request origin (allows all)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/test", (req, res) => {
  res.json("Welcome to Jumkas API");
});

// const url = "mongodb://localhost:27017";

console.log("MONGO_URI:", process.env.MONGO_URI);


const dbName = "jumkasDB";

MongoClient.connect(process.env.MONGO_URI)
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
