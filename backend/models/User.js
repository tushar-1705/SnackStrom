
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    birthdate: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },
    favoriteSnack: {
      type: String,
      default: "",
    },
    favoriteDrink: {
      type: String,
      default: "",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    postsCount: {
      type: Number,
      default: 0
    },
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true, 
  }
);


const User = mongoose.model("User", userSchema);

module.exports = User;
