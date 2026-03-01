const responseController = require("./responseController");
require("dotenv").config();

const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

let refreshTokens = [];

async function refreshToken(req, res) {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ email: user.email });
      res.json({ token: accessToken });
    });
  } catch (err) {
    console.log(`error handling : ${err}`);
  }
}

async function authRegister(req, res) {
  try {
    const db = req.app.locals.db;
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.json(responseController.failed("missing fields"));

    const result = await db
      .collection("acl_users")
      .insertOne({ firstName, lastName, email, password });

    if (!result.acknowledged) {
      return res.json(responseController.error("Something went wrong"));
    }

    res.json(
      responseController.success("User registered successfully", {
        id: result.insertedId,
      }),
    );
  } catch (err) {
    console.log("error handling :" + err);
  }
}

async function authLogin(req, res) {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json(responseController.failed("Missing email or password"));
    }

    // 2️⃣ Find user
    const login = await db.collection("acl_users").findOne({ email });
    if (!login) {
      return res.status(404).json(responseController.failed("User not found"));
    }

    // 3️⃣ Check password (plain comparison example)
    if (login.password !== password) {
      return res
        .status(401)
        .json(responseController.failed("Invalid password"));
    }

    const userEmail = { email: login.email };
    // 4️⃣ Generate JWT token
    const token = generateAccessToken(userEmail);

    const refreshToken = jwt.sign(userEmail, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    // 5️⃣ Send success response
    return res.status(200).json(
      responseController.success("Login successful", {
        token,
        refreshToken,
        user: {
          id: login._id,
          email: login.email,
          firstName: login.firstName,
          lastName: login.lastName,
        },
      }),
    );
  } catch (error) {
    console.error("LOGIN ERROR:1", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function test(req, res) {
  res.json("xxxx");
}

module.exports = { authRegister, authLogin, refreshToken, test };
