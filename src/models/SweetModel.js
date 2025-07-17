const mongoose = require("mongoose");

const SweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Sweet name is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Sweet category is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Sweet price is required"],
    min: [0, "Price cannot be negative"],
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  quantity: {
    type: Number,
    required: [true, "Sweet quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SweetModel = mongoose.model("Sweet", SweetSchema);

module.exports = SweetModel;
