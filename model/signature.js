const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SignatureSchema = new Schema({
  signature: {
    type: String,
    required: true
  }
});

SignatureSchema.set("timestamps", true);

module.exports = Signature = mongoose.model("Signature", SignatureSchema);
