# 🎥 VideoMeet - Real-Time Video Conferencing Platform

<div align="center">

![VideoMeet Banner](https://img.shields.io/badge/VideoMeet-Conference%20Made%20Simple-blue?style=for-the-badge&logo=webrtc)

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.1-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**A powerful, feature-rich video conferencing platform built with modern web technologies**

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🐛 Report Bug](#issues) • [✨ Request Feature](#issues)

</div>

---

## Live Project Deployed Link
https://videocallapp-frontend-ckk3.onrender.com

---

## Live Project Demo
https://drive.google.com/file/d/1hoPQ_Fj6fbJGjIUeupJRlFiod73goUGt/view?usp=sharing

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Key Highlights](#-key-highlights)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📱 Usage](#-usage)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🔌 API Documentation](#-api-documentation)
- [🎨 UI Components](#-ui-components)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Contact](#-contact)

---

## ✨ Features

### 🎬 Core Video Features
- **HD Video & Audio** - Crystal clear peer-to-peer video conferencing using WebRTC
- **Screen Sharing** - Share your screen with participants with permission controls
- **Flexible Layouts** - Automatic grid/stack view switching based on participant count
- **Camera & Mic Controls** - Toggle video and audio with real-time status indicators
- **Picture Quality** - Adaptive bitrate streaming for optimal quality

### 👥 User Management
- **Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- **User Profiles** - Personalized user profiles with name and email
- **Session Management** - Persistent sessions with token-based authentication

### 🎛️ Admin Controls
- **Waiting Room** - Host approval system for enhanced meeting security
- **Permission Management** - Granular control over participant permissions:
  - Microphone access
  - Camera access
  - Screen sharing capabilities
- **Participant Removal** - Remove disruptive users from meetings
- **Meeting Settings** - Configure meeting behavior:
  - Require admission
  - Mute mic on entry
  - Disable video on entry
  - Control screen sharing

### 💬 Communication
- **Real-time Chat** - In-meeting text chat with message history
- **Chat Persistence** - All messages saved to database
- **User Indicators** - See who sent each message with timestamps

### 🔐 Security & Privacy
- **End-to-End Encryption** - WebRTC peer-to-peer encrypted connections
- **Secure Authentication** - JWT tokens with expiration
- **Password Hashing** - Bcrypt for secure password storage
- **Meeting Access Control** - Unique meeting IDs with host controls

---

## 🎯 Key Highlights

<div align="center">

| Feature | Description |
|---------|-------------|
| 🎥 **WebRTC P2P** | Direct peer-to-peer connections for low latency |
| ⚡ **Real-time** | Socket.io for instant bidirectional communication |
| 🎨 **Modern UI** | Sleek Tailwind CSS design with dark mode |
| 📱 **Responsive** | Works seamlessly on desktop, tablet, and mobile |
| 🔄 **Auto Reconnect** | Handles network issues gracefully |
| 🌐 **STUN Servers** | Reliable connection establishment |
| 💾 **Persistent** | MongoDB for data persistence |
| 🚀 **Scalable** | Built to handle multiple concurrent meetings |

</div>

---

## 🏗️ Architecture

```mermaid
graph TB
    A[Client - React App] -->|Socket.io| B[Node.js Server]
    A -->|WebRTC P2P| C[Other Clients]
    B -->|Store/Retrieve| D[MongoDB]
    B -->|Signaling| A
    B -->|Chat Messages| D
    B -->|Meeting Data| D
    B -->|User Auth| D
    
    style A fill:#61DAFB
    style B fill:#339933
    style C fill:#61DAFB
    style D fill:#47A248
```

### System Flow

1. **Authentication Layer** - Users sign up/login with JWT authentication
2. **Meeting Creation** - Host creates meeting with unique ID
3. **Socket Connection** - Real-time bidirectional communication via Socket.io
4. **WebRTC Signaling** - Peer connection negotiation through server
5. **P2P Streaming** - Direct video/audio streaming between peers
6. **Permission Control** - Admin manages participant permissions
7. **Chat System** - Real-time messaging with MongoDB persistence

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

### One-Line Install

```bash
git clone https://github.com/yourusername/videomeet.git && cd videomeet && npm run install && npm run build && npm start
```

---

## ⚙️ Installation

### Step-by-Step Guide

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/videomeet.git
cd videomeet
```

#### 2️⃣ Install Dependencies

This will install dependencies for both client and server:

```bash
npm run install
```

Or manually:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 3️⃣ Configure Environment Variables

Create `.env` files in both client and server directories:

**Server `.env` file** (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://your-mongodb-uri
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Client `.env` file** (`client/.env`):
```env
VITE_SERVER_URL=http://localhost:5000/
VITE_API_URL=http://localhost:5000
```

#### 4️⃣ Build the Application

```bash
npm run build
```

#### 5️⃣ Start the Server

```bash
npm start
```

The application will be available at `http://localhost:5000`

---

## 🔧 Configuration

### MongoDB Setup

#### Option 1: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Add to `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/videomeet?retryWrites=true&w=majority
   ```

#### Option 2: Local MongoDB

```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod

# Update .env
MONGO_URI=mongodb://localhost:27017/videomeet
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/videomeet` |
| `FRONTEND_URL` | Client URL for CORS | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `VITE_SERVER_URL` | Backend URL from client | `http://localhost:5000/` |

---

## 📱 Usage

### For Regular Users

#### 1. Sign Up / Login
- Navigate to the app
- Create an account or login
- You'll be redirected to the home page

#### 2. Create a Meeting
- Click "Create New Meeting"
- Share the meeting ID with participants
- You become the meeting host/admin

#### 3. Join a Meeting
- Enter the meeting ID
- Click "Join"
- Wait for host approval (if required)

#### 4. In-Meeting Controls
- **Mic Toggle** - Mute/unmute your microphone
- **Camera Toggle** - Turn video on/off
- **Screen Share** - Share your screen (with permission)
- **Chat** - Send messages to all participants
- **Leave** - Exit the meeting

### For Meeting Hosts

#### Admin Panel Features

1. **Waiting Room Management**
   - See users waiting to join
   - Admit or deny entry

2. **Participant Controls**
   - Toggle mic permissions
   - Toggle video permissions
   - Enable/disable screen sharing
   - Remove participants

3. **Meeting Settings**
   - Require admission
   - Mute mic on entry
   - Disable video on entry
   - Control screen share access

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework |
| **React Router** | 7.9.4 | Client-side routing |
| **Socket.io Client** | 4.8.1 | Real-time communication |
| **Tailwind CSS** | 4.1.14 | Styling framework |
| **Axios** | 1.12.2 | HTTP client |
| **Lucide React** | 0.546.0 | Icon library |
| **date-fns** | 4.1.0 | Date formatting |
| **uuid** | 13.0.0 | Unique ID generation |
| **Vite** | 7.1.7 | Build tool |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 5.1.0 | Web framework |
| **Socket.io** | 4.8.1 | WebSocket server |
| **MongoDB** | 8.19.1 | Database |
| **Mongoose** | 8.19.1 | ODM for MongoDB |
| **JWT** | 9.0.2 | Authentication |
| **bcryptjs** | 3.0.2 | Password hashing |
| **cors** | 2.8.5 | Cross-origin requests |
| **dotenv** | 17.2.3 | Environment variables |

### WebRTC
- **STUN Servers** - Google STUN for NAT traversal
- **Peer-to-Peer** - Direct browser-to-browser connections

---

## 📂 Project Structure

```
videomeet/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/              # Images and assets
│   │   ├── components/          # React components
│   │   │   ├── AdminPanel.jsx   # Meeting admin controls
│   │   │   ├── ChatPanel.jsx    # Chat interface
│   │   │   ├── Controls.jsx     # Meeting controls
│   │   │   ├── PrivateRoute.jsx # Route protection
│   │   │   ├── TopBar.jsx       # Navigation bar
│   │   │   ├── VideoGrid.jsx    # Video layout
│   │   │   └── WaitingRoomModal.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx         # Home/dashboard
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Meeting.jsx      # Meeting room
│   │   │   └── Signup.jsx       # Registration
│   │   ├── services/            # API services
│   │   │   └── socket.js        # Socket.io client
│   │   ├── utils/               # Utility functions
│   │   │   └── storage.js       # LocalStorage helpers
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Global styles
│   │   └── main.jsx             # Entry point
│   ├── .env                     # Environment variables
│   ├── index.html               # HTML template
│   ├── package.json             # Dependencies
│   └── vite.config.js           # Vite configuration
│
├── server/                      # Backend Node.js application
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   └── adminController.js
│   │   ├── middleware/          # Custom middleware
│   │   │   └── auth.js          # JWT authentication
│   │   ├── models/              # Mongoose models
│   │   │   ├── ChatMessage.js   # Chat message schema
│   │   │   ├── Meeting.js       # Meeting schema
│   │   │   └── User.js          # User schema
│   │   ├── routes/              # API routes
│   │   │   ├── adminRoutes.js   # Admin endpoints
│   │   │   ├── meetingsRoutes.js
│   │   │   └── users.js         # Auth endpoints
│   │   ├── socket.js            # Socket.io logic
│   │   └── index.js             # Server entry point
│   ├── .env                     # Environment variables
│   ├── package.json             # Dependencies
│   └── readme.md
│
├── package.json                 # Root package.json
└── README.md                    # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/users/signup`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/users/login`
Authenticate user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Meeting Endpoints

#### POST `/api/meetings`
Create a new meeting

**Request Body:**
```json
{
  "meetingId": "abc123xyz",
  "createdBy": "userId"
}
```

**Response:**
```json
{
  "message": "Meeting created",
  "meeting": {
    "_id": "mongoId",
    "meetingId": "abc123xyz",
    "createdBy": "userId",
    "settings": { ... }
  }
}
```

#### GET `/api/meetings/:id`
Check if meeting exists

**Response:**
```json
{
  "exists": true,
  "meeting": { ... }
}
```

### Admin Endpoints (Protected)

All admin endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

#### PATCH `/api/admin/:meetingId/settings`
Update meeting settings

**Request Body:**
```json
{
  "settings": {
    "requireAdmission": true,
    "muteMicOnEntry": false,
    "disableVideoOnEntry": false,
    "allowScreenShare": true
  }
}
```

#### POST `/api/admin/:meetingId/admit/:userId`
Admit user from waiting room

#### POST `/api/admin/:meetingId/deny/:userId`
Deny user entry

#### DELETE `/api/admin/:meetingId/participants/:userId`
Remove participant from meeting

### Socket Events

#### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join-meeting` | `{ meetingId, user }` | Join a meeting |
| `leave-meeting` | `{ meetingId }` | Leave meeting |
| `chat-message` | `{ meetingId, message, user }` | Send chat message |
| `webrtc-offer` | `{ to, sdp, fromUser }` | Send WebRTC offer |
| `webrtc-answer` | `{ to, sdp }` | Send WebRTC answer |
| `ice-candidate` | `{ to, candidate }` | Send ICE candidate |
| `admit-user` | `{ meetingId, userId, socketId }` | Admit user (admin) |
| `deny-user` | `{ meetingId, userId, socketId }` | Deny user (admin) |
| `update-permissions` | `{ meetingId, userId, permissions }` | Update permissions |
| `remove-participant` | `{ meetingId, userId }` | Remove user (admin) |

#### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `meeting-joined` | `{ isAdmin, permissions, settings }` | Joined successfully |
| `waiting-room` | - | Placed in waiting room |
| `admission-granted` | `{ permissions, settings }` | Admitted to meeting |
| `admission-denied` | - | Entry denied |
| `user-joined` | `{ socketId, user, permissions }` | User joined |
| `user-left` | `{ socketId }` | User left |
| `chat-message` | `{ message, user, timestamp }` | Chat message |
| `chat-history` | `[messages]` | Historical messages |
| `meeting-participants` | `[participants]` | Current participants |
| `permissions-updated` | `{ permissions }` | Permissions changed |
| `removed-by-admin` | - | Kicked from meeting |

---

## 🎨 UI Components

### VideoGrid Component
Renders participant video tiles with automatic layout switching:
- **Grid Layout** - For 2-6 participants
- **Stack Layout** - For 7+ participants
- Auto-switches based on participant count
- Individual mute controls per tile

### Controls Component
Meeting control bar with:
- Mic toggle button
- Camera toggle button
- Screen share button
- Chat toggle button
- Leave meeting button
- Participant count display

### ChatPanel Component
Real-time chat interface featuring:
- Message history
- User avatars
- Timestamps
- Message input
- Scroll to bottom on new messages

### AdminPanel Component
Host control panel with:
- Participant list with permissions
- Waiting room queue
- Admit/deny controls
- Permission toggles
- Meeting settings

### WaitingRoom Component
Displays when user is in waiting room:
- Loading animation
- Instructions for users
- Cancel option

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear commit messages
- Add comments for complex logic
- Follow existing code style
- Update documentation for new features
- Add tests if applicable
- Ensure build passes before submitting PR

### Code Style

- **Frontend**: ESLint + React best practices
- **Backend**: Node.js best practices
- **Formatting**: Prettier (auto-format on save)

---


### Future Enhancements

- [ ] Recording functionality
- [ ] Virtual backgrounds
- [ ] Breakout rooms
- [ ] Hand raise feature
- [ ] Polls and reactions
- [ ] Calendar integration
- [ ] Email invitations
- [ ] Meeting analytics
- [ ] White boarding
- [ ] File sharing

---

## 👥 Contact

**Project Maintainer** - Ravinder Singh

- 📧 Email: ravindersingh74123@gmail.com

---

## 🙏 Acknowledgments

- [WebRTC](https://webrtc.org/) for peer-to-peer technology
- [Socket.io](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) team for the amazing framework
- [MongoDB](https://www.mongodb.com/) for database solutions
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- All contributors who help improve this project

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/videomeet?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/videomeet?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/videomeet)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/videomeet)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by developers, for developers**

[Back to Top](#-videomeet---real-time-video-conferencing-platform)

</div>
