const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const authRouter = require("./src/routers/authRouter");
const productsRouter = require("./src/routers/productsRouter");

const app = express();
const PORT = process.env.PORT || 8010;


if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

app.use(helmet());
app.use(compression());


const allowedOrigins =
  [
    "http://localhost:5173",
    "http://3.107.253.64:5173",
  ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);



app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


app.get("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to Jumkas API" });
});


app.use("/auth", authRouter);
app.use("/products", productsRouter);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err.message);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// =======================
// Mongo + Server Bootstrap
// =======================
let client;

async function startServer() {
  try {
    client = new MongoClient(process.env.MONGO_URI, {
      maxPoolSize: 10,
    });

    await client.connect();

    console.log("✅ Connected to MongoDB Atlas");

    app.locals.db = client.db(process.env.DB_NAME || "jumkasDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

startServer();

// =======================
// Graceful Shutdown
// =======================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");

  if (client) {
    await client.close();
    console.log("📦 MongoDB connection closed");
  }

  process.exit(0);
});
