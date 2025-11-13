const express = require("express");
const router = express.Router();
const { authRegister, authLogin, refreshToken, test } = require("../controllers/authController");
const validateToken = require("../middleware/validateToken");

router.post("/register", authRegister);
router.post("/login", authLogin);
router.post("/refreshToken", refreshToken);
router.post("/test",validateToken, test);



module.exports = router;
