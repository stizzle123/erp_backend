const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SignatureSchema = new Schema({
  signature: {
    data: Buffer,
    contentType: String
  }
});

SignatureSchema.set("timestamps", true);

module.exports = Signature = mongoose.model("Signature", SignatureSchema);
