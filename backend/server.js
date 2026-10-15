require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const notificationRoutes = require("./routes/notificationRoutes");
const checkLogRoutes = require("./routes/checkLogRoutes");
const passRoutes = require("./routes/passRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

connectDB();

app.use("/api/notifications", notificationRoutes);
app.use("/api/checklogs", checkLogRoutes);
app.use("/api/passes", passRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Visitor Pass Management System API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
