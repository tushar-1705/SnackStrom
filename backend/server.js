const express = require("express");
const cors = require("cors");
require("dotenv").config();

process.env.MONGODB_URI = process.env.MONGODB_URI
process.env.PORT = process.env.PORT 
process.env.JWT_SECRET = process.env.JWT_SECRET 

const app = express();
const db = require('./config/db');
const morgan = require('morgan');

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Rainy Day Snacks & Drinks API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      posts: "/api/posts",
      users: "/api/users"
    }
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
