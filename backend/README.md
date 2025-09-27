# Rainy Day Snacks & Drinks API

A community API for sharing favorite rainy-day snacks and drinks. Built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register, login, and profile management
- **Post Management**: Create, read, update, and delete snack/drink posts
- **Social Features**: Follow users, like posts, add comments
- **Search & Filter**: Search posts by type, weather, tags, and more
- **User Feed**: Personalized feed based on followed users

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/rainy-day-snacks

# JWT Secret (generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /refresh-token` - Refresh access token
- `GET /profile` - Get current user profile
- `POST /logout` - Logout user

### Posts (`/api/posts`)
- `POST /` - Create a new post (requires auth)
- `GET /` - Get all posts with pagination and filters
- `GET /:id` - Get a specific post
- `PUT /:id` - Update a post (requires auth)
- `DELETE /:id` - Delete a post (requires auth)
- `POST /:id/like` - Like/unlike a post (requires auth)
- `POST /:id/comment` - Add comment to post (requires auth)
- `GET /user/:userId` - Get posts by specific user

### Users (`/api/users`)
- `GET /profile/:userId` - Get user profile
- `PUT /profile` - Update user profile (requires auth)
- `PUT /change-password` - Change password (requires auth)
- `POST /:userId/follow` - Follow/unfollow user (requires auth)
- `GET /:userId/followers` - Get user's followers
- `GET /:userId/following` - Get user's following
- `GET /search` - Search users
- `GET /feed` - Get personalized feed (requires auth)

## Post Schema

```javascript
{
  type: "snack" | "drink",
  title: String,
  description: String,
  image: String (URL),
  tags: [String],
  ingredients: [String],
  preparationTime: Number (minutes),
  difficulty: "easy" | "medium" | "hard",
  servings: Number,
  weather: "rainy" | "cloudy" | "stormy" | "any",
  likes: [User IDs],
  comments: [Comment Objects],
  isPublic: Boolean
}
```

## User Schema

```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  profilePic: String (URL),
  bio: String,
  favoriteSnack: String,
  favoriteDrink: String,
  location: String,
  followers: [User IDs],
  following: [User IDs],
  isVerified: Boolean,
  role: "user"
}
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Example Usage

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "snacklover",
    "email": "user@example.com",
    "password": "Password123",
    "fullName": "John Doe",
    "profilePic": "https://example.com/profile.jpg"
  }'
```

### Create a post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "type": "snack",
    "title": "Rainy Day Cookies",
    "description": "Perfect chocolate chip cookies for a cozy rainy day",
    "image": "https://example.com/cookies.jpg",
    "tags": ["cookies", "chocolate", "comfort"],
    "ingredients": ["flour", "butter", "chocolate chips"],
    "preparationTime": 30,
    "difficulty": "easy",
    "servings": 12,
    "weather": "rainy"
  }'
```

## Contributing

This is a hackathon project. Feel free to suggest improvements or report issues!

## License

MIT

