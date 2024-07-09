const mongoose = require("mongoose");

const contactListSchema = mongoose.Schema(
  {
    
    firstName: { type: String, required: [true, "please add the first name"] },
    lastName: { type: String, required: [true, "please add the last name"] },
    email: { type: String, required: [true, "please add the email"] },
    phone: { type: String, required: [true, "please add the phonenumber"] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contacts", contactListSchema);
