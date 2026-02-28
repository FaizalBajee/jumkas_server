const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { addProducts ,getProducts } = require("../controllers/productsController");
const validateToken = require("../middleware/validateToken");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});

const upload = multer({ storage });

router.post("/AddProduct", validateToken, upload.single("image"), addProducts);
router.get("/GetProducts",  getProducts); 


module.exports = router;
