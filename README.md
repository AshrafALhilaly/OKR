# OKR Platform

A modern, full-stack web application for managing Objectives and Key Results (OKRs).

## Features

- ✨ **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 📊 **Track Progress** - Real-time progress tracking for objectives and key results
- 🎯 **Manage OKRs** - Create, update, and delete objectives and their key results
- 💾 **Data Persistence** - SQLite database for reliable data storage
- 🚀 **Full-Stack** - React + TypeScript frontend, Node.js + Express backend

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- SQLite (better-sqlite3)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd okr-platform
```

2. Install dependencies for both frontend and backend:
```bash
npm run install-all
```

Or install manually:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Running the Application

Start both the backend and frontend servers:
```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

The frontend will automatically proxy API requests to the backend.

### Running Separately

If you prefer to run the servers separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## Project Structure

```
okr-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types.ts       # TypeScript type definitions
│   │   ├── App.tsx        # Main App component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── server/                # Backend Express application
│   ├── index.js           # Express server
│   └── database.js        # Database operations
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Objectives
- `GET /api/objectives` - Get all objectives
- `POST /api/objectives` - Create a new objective
- `PUT /api/objectives/:id` - Update an objective
- `DELETE /api/objectives/:id` - Delete an objective

### Key Results
- `GET /api/objectives/:objectiveId/keyresults` - Get key results for an objective
- `POST /api/objectives/:objectiveId/keyresults` - Create a new key result
- `PUT /api/keyresults/:id` - Update a key result
- `DELETE /api/keyresults/:id` - Delete a key result

## Usage

1. **Create an Objective**: Click the "+ New Objective" button and fill in the details
2. **Add Key Results**: Expand an objective and click "+ Add Key Result" to add measurable outcomes
3. **Track Progress**: Update the current value of key results to automatically calculate progress
4. **Manage OKRs**: Edit, delete, or mark objectives as completed

## Building for Production

Build the frontend for production:
```bash
npm run build
```

The built files will be in the `client/dist` directory.

## License

ISC
