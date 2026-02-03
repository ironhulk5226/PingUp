# PingUp - Social Media Platform

PingUp is a full-stack social media platform built with React.js frontend and Node.js backend. It provides features like user authentication, posting, stories, messaging, and real-time notifications.

## 🚀 Features

- **User Authentication** - Secure authentication using Clerk
- **Social Posts** - Create, like, and interact with posts
- **Stories** - Share temporary stories with followers
- **Real-time Messaging** - Chat with other users
- **User Connections** - Follow/unfollow system
- **Profile Management** - Customizable user profiles
- **Media Upload** - Image and video uploads via Cloudinary/ImageKit
- **Real-time Notifications** - Powered by Inngest
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🏗️ Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router Dom** - Client-side routing
- **Clerk** - Authentication and user management
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Moment.js** - Date/time handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Clerk Express** - Server-side authentication
- **Cloudinary** - Image/video storage
- **ImageKit** - Alternative media storage
- **Multer** - File upload handling
- **Nodemailer** - Email services
- **Inngest** - Background job processing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
PingUp/
├── Frontend/                    # React frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios configuration and interceptors
│   │   ├── app/
│   │   │   └── store.js        # Redux store configuration
│   │   ├── assets/
│   │   │   └── assets.js       # Static asset imports
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Loading.jsx     # Loading spinner component
│   │   │   ├── MenuItems.jsx   # Navigation menu items
│   │   │   ├── Notification.jsx # Notification component
│   │   │   ├── PostCard.jsx    # Individual post display
│   │   │   ├── ProfileModel.jsx # Profile modal/popup
│   │   │   ├── RecentMessages.jsx # Recent messages sidebar
│   │   │   ├── Sidebar.jsx     # Main navigation sidebar
│   │   │   ├── StoriesBar.jsx  # Stories horizontal bar
│   │   │   ├── StoryModel.jsx  # Story creation modal
│   │   │   ├── StoryViewer.jsx # Story viewing interface
│   │   │   ├── UserCard.jsx    # User profile card
│   │   │   └── UserProfileInfo.jsx # Detailed user info
│   │   ├── features/           # Redux slices for state management
│   │   │   ├── connections/
│   │   │   │   └── connectionsSlice.js # User connections state
│   │   │   ├── messages/
│   │   │   │   └── messagesSlice.js    # Chat messages state
│   │   │   └── user/
│   │   │       └── userSlice.js        # Current user state
│   │   ├── pages/              # Main application pages
│   │   │   ├── Chatbox.jsx     # Individual chat interface
│   │   │   ├── Connections.jsx # User connections page
│   │   │   ├── CreatePost.jsx  # Post creation page
│   │   │   ├── Discover.jsx    # Discover new users
│   │   │   ├── Feed.jsx        # Main timeline/feed
│   │   │   ├── Layout.jsx      # App layout wrapper
│   │   │   ├── Login.jsx       # Authentication page
│   │   │   ├── Messages.jsx    # Messages overview
│   │   │   └── Profile.jsx     # User profile page
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # React app entry point
│   ├── eslint.config.js        # ESLint configuration
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vercel.json             # Vercel deployment config
│   └── vite.config.js          # Vite build configuration
│
└── Backend/                    # Node.js backend API
    ├── configs/                # Configuration files
    │   ├── cloudinary.js       # Cloudinary setup
    │   ├── db.js               # MongoDB connection
    │   ├── imageKit.js         # ImageKit configuration
    │   ├── multer.js           # File upload middleware
    │   └── nodemailer.js       # Email configuration
    ├── controllers/            # Request handlers
    │   ├── messageController.js # Chat message operations
    │   ├── postController.js   # Post CRUD operations
    │   ├── storyController.js  # Story management
    │   └── userController.js   # User operations
    ├── inngest/                # Background job processing
    │   └── index.js            # Inngest functions definition
    ├── middlewares/            # Custom middleware
    │   └── auth.js             # Authentication middleware
    ├── models/                 # Database schemas
    │   ├── connection.js       # User connections model
    │   ├── message.js          # Chat message model
    │   ├── post.js             # Social post model
    │   ├── story.js            # Story model
    │   └── user.js             # User profile model
    ├── routes/                 # API route definitions
    │   ├── messageRouter.js    # Message endpoints
    │   ├── postRouter.js       # Post endpoints
    │   ├── storyRoutes.js      # Story endpoints
    │   └── userRoutes.js       # User endpoints
    ├── backup.txt              # Database backup
    ├── package.json            # Backend dependencies
    ├── server.js               # Express server entry point
    └── vercel.json             # Backend deployment config
```

## 🔄 Application Flow

### 1. Authentication Flow
1. User visits the app and is redirected to Clerk authentication
2. After successful login, user data is synced with MongoDB
3. JWT tokens are managed by Clerk for secure API access
4. Protected routes are accessible only to authenticated users

### 2. Feed Flow
1. User lands on the main feed (`/`)
2. Redux fetches user data and connections
3. Posts are loaded from the backend API
4. Real-time updates via Redux state management
5. User can interact with posts (like, comment, share)

### 3. Posting Flow
1. User navigates to Create Post page
2. Content and media are uploaded via Cloudinary/ImageKit
3. Post data is saved to MongoDB
4. Feed updates automatically with new post
5. Followers receive notifications via Inngest

### 4. Messaging Flow
1. User selects a conversation or starts new chat
2. Real-time messages are managed via Redux
3. Messages are stored in MongoDB
4. WebSocket-like updates through polling/state management

### 5. Stories Flow
1. User creates story with media upload
2. Story is temporarily stored (24-hour expiry)
3. Followers can view stories in stories bar
4. Stories automatically expire after set duration

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account
- ImageKit account (optional)
- Clerk account for authentication
- Inngest account for background jobs

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   INNGEST_EVENT_KEY=your_inngest_event_key
   NODEMAILER_EMAIL=your_email
   NODEMAILER_PASSWORD=your_email_password
   ```

4. Start the development server:
   ```bash
   npm run server
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚦 API Endpoints

### User Routes (`/api/user`)
- `GET /profile` - Get user profile
- `POST /update-profile` - Update user profile
- `GET /search` - Search users
- `POST /follow` - Follow a user
- `POST /unfollow` - Unfollow a user

### Post Routes (`/api/post`)
- `GET /` - Get all posts (feed)
- `POST /create` - Create a new post
- `POST /like` - Like/unlike a post
- `POST /comment` - Add comment to post
- `DELETE /:id` - Delete a post

### Story Routes (`/api/story`)
- `GET /` - Get all active stories
- `POST /create` - Create a new story
- `GET /:id/view` - Mark story as viewed
- `DELETE /:id` - Delete a story

### Message Routes (`/api/message`)
- `GET /conversations` - Get user conversations
- `GET /:userId/messages` - Get messages with specific user
- `POST /send` - Send a message
- `PUT /:id/read` - Mark message as read

## 🔐 Authentication & Authorization

The application uses Clerk for authentication with the following flow:
1. **Frontend**: Clerk React components handle login/signup UI
2. **Backend**: Clerk Express middleware validates JWT tokens
3. **Protected Routes**: Custom `protect` middleware ensures authenticated access
4. **User Sync**: User data is synchronized between Clerk and MongoDB

## 🗄️ Database Schema

### User Model
```javascript
{
  clerkId: String,      // Clerk user ID
  email: String,
  username: String,
  firstName: String,
  lastName: String,
  avatar: String,       // Profile picture URL
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  posts: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  author: ObjectId,     // Reference to User
  content: String,
  media: [{
    type: String,       // 'image' or 'video'
    url: String,
    publicId: String    // Cloudinary public ID
  }],
  likes: [ObjectId],    // User IDs who liked
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Story Model
```javascript
{
  author: ObjectId,
  media: {
    type: String,
    url: String,
    publicId: String
  },
  views: [ObjectId],    // User IDs who viewed
  expiresAt: Date,      // 24 hours from creation
  createdAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId,
  receiver: ObjectId,
  content: String,
  isRead: Boolean,
  createdAt: Date
}
```

## 🚀 Deployment

### Backend (Vercel)
1. Configure `vercel.json` for serverless functions
2. Set environment variables in Vercel dashboard
3. Deploy using Vercel CLI or GitHub integration

### Frontend (Vercel)
1. Configure build settings for Vite
2. Set environment variables
3. Deploy from GitHub repository

### Database
- MongoDB Atlas for production database
- Configure connection string in environment variables

## 🔧 Development Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run server   # Start development server with nodemon
npm start        # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

- **GitHub**: [@ironhulk5226](https://github.com/ironhulk5226)

## 🐛 Known Issues

- Real-time messaging could be improved with WebSocket implementation
- Story expiration handling needs optimization
- Media upload progress indicators needed


