# VideoCallApp



VideoCallApp is a full-stack, real-time video conferencing application designed for seamless virtual meetings. It features user authentication, dynamic meeting creation, and a robust in-meeting experience including video/audio chat, screen sharing, and administrative controls. The application is built with a modern tech stack, utilizing React and Vite on the frontend, and a Node.js/Express backend with MongoDB for data persistence and Socket.IO for real-time WebRTC signaling.

## Features

-   **User Authentication:** Secure user signup and login system using JWT (JSON Web Tokens).
-   **Meeting Management:**
    -   Create new meetings with a unique, shareable ID.
    -   Join existing meetings using the meeting ID.
-   **Real-Time Communication:** High-quality video and audio streaming powered by WebRTC.
-   **Interactive Controls:**
    -   Toggle microphone mute/unmute.
    -   Toggle camera on/off.
    -   Screen sharing functionality.
-   **In-Meeting Chat:** A persistent chat panel for text-based communication during the meeting.
-   **Admin & Host Controls:**
    -   A dedicated admin panel for meeting hosts.
    -   **Waiting Room:** Admins can admit or deny entry to participants.
    -   **Participant Management:** Admins can remove users from the meeting.
    -   **Permissions Control:** Granularly enable/disable microphone, video, and screen sharing capabilities for individual participants.
    -   **Meeting Settings:** Configure meeting policies like requiring admin admission and muting participants on entry.
-   **Responsive UI:** A clean and responsive user interface built with Tailwind CSS, featuring adaptive video grid layouts.

## Tech Stack

-   **Frontend:**
    -   React
    -   Vite
    -   Tailwind CSS
    -   Socket.IO Client
    -   React Router
    -   Axios
    -   Lucide React (for icons)
-   **Backend:**
    -   Node.js
    -   Express.js
    -   MongoDB with Mongoose
    -   Socket.IO
    -   WEBRTC
    -   JSON Web Tokens (JWT)
    -   Bcrypt.js

## Project Structure

The repository is a monorepo containing two main directories:

-   `client/`: Contains the frontend React application built with Vite.
-   `server/`: Contains the backend Node.js, Express, and Socket.IO server.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm (or yarn/pnpm)
-   A running MongoDB instance (local or cloud-based like MongoDB Atlas)

### Server Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ravindersingh74123/VideoCallApp.git
    cd VideoCallApp/server
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create an environment file:**
    Create a `.env` file in the `server` directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    FRONTEND_URL=http://localhost:5173
    JWT_SECRET=your_super_secret_jwt_key
    ```
4.  **Start the server:**
    ```sh
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

### Client Setup

1.  **Navigate to the client directory:**
    ```sh
    # From the root directory
    cd ../client
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create an environment file:**
    The `vite.config.js` uses a proxy for API calls, but the Socket.IO connection requires a direct URL. Create a `.env` file in the `client` directory and set the backend URL:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4.  **Start the client:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Available Scripts

### Server

-   `npm run dev`: Starts the server in development mode using `nodemon`.

### Client

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Bundles the application for production.
-   `npm run lint`: Lints the source code using ESLint.
-   `npm run preview`: Serves the production build locally for preview.

## API Endpoints

The server exposes the following REST API endpoints:

### User Authentication

-   `POST /api/users/signup`: Register a new user.
-   `POST /api/users/login`: Log in a user and receive a JWT.

### Meetings

-   `POST /api/meetings`: Create a new meeting.
-   `GET /api/meetings/:id`: Check if a meeting exists and retrieve its details.
-   `GET /api/meetings/:id/messages`: Get chat history for a meeting.

### Admin Controls

-   `PATCH /api/admin/:meetingId/settings`: Update meeting-wide settings (as admin).
-   `DELETE /api/admin/:meetingId/participants/:userId`: Remove a participant from the meeting (as admin).
-   `POST /api/admin/:meetingId/admit/:userId`: Admit a user from the waiting room.
-   ...and more for managing participant permissions.
