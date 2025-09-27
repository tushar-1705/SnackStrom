const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["snack", "drink"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop',
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    ingredients: [{
      type: String,
      trim: true,
    }],
    preparationTime: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    servings: {
      type: Number,
      default: 1,
    },
    weather: {
      type: String,
      enum: ["rainy", "cloudy", "stormy", "any"],
      default: "rainy",
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
        maxlength: 200,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ weather: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
