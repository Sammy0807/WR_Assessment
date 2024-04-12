
# WR_Assessment Application

## Introduction
Welcome to the WR_Assessment tic-tac-toe game! Embark on a classic gaming adventure where strategy meets fun. Whether you're in the mood for a quick match with a friend or aiming to climb the ranks in our leaderboard, our app is designed to deliver a seamless and engaging tic-tac-toe experience. Enjoy the nostalgia of this beloved game brought to life with a modern twist!

## Features
- **Interactive Gameplay**: Start, join, and play tic-tac-toe games in real-time.
- **Live Notifications**: Stay informed with in-game notifications and updates.
- **Pause and Resume**: Freedom to leave a game and come back to finish it later.
- **Ranking System**: Track your wins and climb the leaderboard to become the ultimate champion.
- **Responsive Design**: Play effortlessly from any device, thanks to a user-friendly interface.

## Quick Start

### Prerequisites
- Node.js v20.12.1
- npm 10.5.0
- PostgreSQL

### Setup

Clone the repository and install the dependencies for both frontend and backend:

```bash
# Clone the repository
git clone https://github.com/Sammy0807/WR_Assessment.git
# Navigate into the repository
cd WR_Assessment
# Install frontend dependencies
cd frontend
npm install --legacy-peer-deps
# Install backend dependencies
cd ../backend
npm install
```

### Configuration

Configure your environment variables in the backend:

```bash
# Navigate to the backend directory
cd backend
# Create a .env file and add the following
echo "DATABASE_URL=your_postgress_database_url" > .env
echo "PORT=your_preferred_port_number" >> .env
```

Replace `your_postgress_database_url` with your PostgreSQL database URL and `your_preferred_port_number` with the port number you want the server to use.

### Run the Application

To start the server, use:

```bash
# Start the backend server
npm run dev
```

Navigate to the frontend directory to start the React app:

```bash
# Start the frontend application
cd ../frontend
npm start
```

## Testing

For testing, run:

```bash
# Testing the backend
cd backend
npm test
# Testing the frontend
cd ../frontend
npm test
``` 
