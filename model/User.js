const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ['guest', 'host'],
    default: 'guest'
  },
  Book: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);