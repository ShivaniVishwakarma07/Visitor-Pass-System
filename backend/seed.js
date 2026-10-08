const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany({});

    const password = await bcrypt.hash("Password123", 10);

    await User.create([
      {
        name: "System Admin",
        email: "admin@visitorpass.com",
        password,
        role: "admin",
      },
      {
        name: "Security Staff",
        email: "security@visitorpass.com",
        password,
        role: "security",
      },
      {
        name: "Employee Host",
        email: "employee@visitorpass.com",
        password,
        role: "employee",
      },
      {
        name: "Demo Visitor",
        email: "visitor@visitorpass.com",
        password,
        role: "visitor",
      },
    ]);

    console.log("Seed users created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedUsers();
