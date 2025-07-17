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

// GET All Sweets
exports.list = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sweets." });
  }
};

// GET Sweet by ID
exports.get = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ error: "Sweet not found." });
    let sweetData = sweet.toObject();
    if (sweet.image && sweet.image.data) {
      sweetData.imageBase64 = sweet.image.data.toString("base64");
      sweetData.imageContentType = sweet.image.contentType;
    }

    res.status(200).json(sweetData);
  } catch (error) {
    res.status(400).json({ error: "Invalid sweet ID format." });
  }
};

// DELETE Sweet
exports.remove = async (req, res) => {
  try {
    const result = await Sweet.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Sweet not found." });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Invalid sweet ID format." });
  }
};
