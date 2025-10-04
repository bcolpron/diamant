# Diamant Game

A web-based game application built with VueJS frontend, Fastify backend, and shared Zod data models.

## Project Structure

```
diamant/
├── client/          # VueJS frontend application
├── server/          # Fastify backend server
├── shared/          # Shared Zod data models
└── package.json     # Root package.json for workspace
```

## Features

- **VueJS Client**: Modern reactive frontend built with Vue 3 and TypeScript
- **Fastify Server**: High-performance backend API with CORS enabled
- **Shared Models**: Type-safe data validation using Zod schemas
- **CORS Configuration**: Properly configured to allow client-server communication

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bcolpron/diamant.git
cd diamant
```

2. Install dependencies for all packages:
```bash
# Install root dependencies
npm install

# Install shared package dependencies
cd shared && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

3. Build the shared package first:
```bash
cd shared
npm run build
cd ..
```

## Development

### Running the Server

In one terminal, start the Fastify server:

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3001`

### Running the Client

In another terminal, start the VueJS development server:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### CORS Configuration

The Fastify server is configured with CORS to allow requests from:
- `http://localhost:5173` (Vite dev server default)
- `http://localhost:3000` (alternative port)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

You can modify the CORS origins in `server/src/index.ts`.

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Game Management
- `POST /api/games` - Create a new game
  - Body: `{ playerName: string }`
  - Returns: `{ game: GameState, playerId: string }`

- `GET /api/games/:gameId` - Get game state
  - Returns: `{ game: GameState }`

- `POST /api/games/join` - Join an existing game
  - Body: `{ gameId: string, playerName: string }`
  - Returns: `{ game: GameState, playerId: string }`

- `POST /api/games/action` - Perform a game action
  - Body: `{ gameId: string, playerId: string, action: 'collect' | 'continue' }`
  - Returns: `{ game: GameState }`

## Data Models

All data models are defined using Zod schemas in the `shared` package:

- `Player`: Player information (id, name, score)
- `GameState`: Complete game state
- `CreateGameRequest`: Request to create a game
- `JoinGameRequest`: Request to join a game
- `GameActionRequest`: Request to perform a game action

## Building for Production

Build all packages:
```bash
npm run build
```

Or build individually:
```bash
# Build shared models
npm run build:shared

# Build server
npm run build:server

# Build client
npm run build:client
```

## Technology Stack

- **Frontend**: Vue 3, TypeScript, Vite
- **Backend**: Fastify, TypeScript
- **Validation**: Zod
- **CORS**: @fastify/cors

## Development Tools

- **TypeScript**: Strong typing for better development experience
- **tsx**: Fast TypeScript execution for development
- **Vite**: Fast frontend build tool with HMR
- **vue-tsc**: TypeScript support for Vue components
