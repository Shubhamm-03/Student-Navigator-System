require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
}

// Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");

      process.exit();
    }

    const admin = new Admin({
      name: "Administrator",
      email: adminEmail,
      password: adminPassword,
      isPermanent: true,
    });

    await admin.save();

    console.log("🎉 Admin Created Successfully!");
    console.log("--------------------------------");
    console.log(`Email    : ${adminEmail}`);
    console.log("--------------------------------");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();