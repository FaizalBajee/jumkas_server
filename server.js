const express = require("express");
const cors = require("cors");
require("dotenv").config();
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
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/test", (req, res) => {
  res.json("Welcome to Jumkas API");
});

// const url = "mongodb://localhost:27017";

// ✅ Proper startup sequence
async function startServer() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);

    console.log("✅ connected to mongodb");

    app.locals.db = client.db(dbName);

    app.use("/auth", authRouter);
    app.use("/products", productsRouter);

    app.use("", (req, res) => {
      res.json("404 Not Found-");
    });

    app.listen(PORT, () => {
      console.log(`🚀 Running on ${PORT}`);
    });
  } catch (err) {
    console.error("❌ connection failed:", err);
    process.exit(1); // 🔥 important in production
  }
}

startServer();

app.listen(8010, () => {
  console.log("Running...");
});
