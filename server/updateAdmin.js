require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await Admin.findOne({
    email: "admin@studentnavigator.com",
  });

  if (!admin) throw new Error("Admin account not found.");

  admin.email = "subu87892480@gmail.com";
  admin.password = "Shubhamm87892480"; // replace this
  await admin.save(); // password is securely hashed automatically

  console.log("Admin credentials updated.");
  await mongoose.disconnect();
})();