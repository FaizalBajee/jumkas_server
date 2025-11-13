const path = require("path");

async function addProducts(req, res) {
  try {
    console.log(" Adding new product...");

    const db = req.app.locals.db; // get MongoDB instance
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      image: imagePath,
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      success: true,
      message: "✅ Product added successfully",
      data: result.ops ? result.ops[0] : newProduct, // for older/new Mongo versions
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { addProducts };

