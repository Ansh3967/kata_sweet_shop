const Sweet = require("../models/SweetModel");

// ADD Sweet
exports.add = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res
        .status(400)
        .json({ error: "All sweet properties are required." });
    }

    if (price < 0 || quantity < 0) {
      return res
        .status(400)
        .json({ error: "Price and quantity cannot be negative." });
    }
    const imageUrl = req.file ? req.file.path : undefined;

    const newSweet = new Sweet({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : undefined,
    });

    await newSweet.save();
    res.status(201).json(newSweet);
  } catch (error) {
    console.error("Add Sweet Error:", error);
    res.status(500).json({ error: "Server error while adding sweet." });
  }
};
