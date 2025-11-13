const jwt = require("jsonwebtoken");
const response = require("../controllers/responseController");
require("dotenv").config();
const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json(response.failed("Token is not provided", 401));
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    console.log(err);
    if (err) return res.json(response.failed("Invalid token", 403));
    req.user = payload;
    // console.log(req.user)
    next();
  });
};
module.exports = validateToken;
