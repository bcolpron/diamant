import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  CreateGameRequestSchema,
  JoinGameRequestSchema,
  GameActionRequestSchema,
  GameState,
  Player,
} from '@diamant/shared';

const fastify = Fastify({
  logger: true,
});

// Register CORS plugin to allow VueJS frontend to communicate with the server
fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
});

// In-memory game storage (for demonstration purposes)
const games = new Map<string, GameState>();

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Create a new game
fastify.post('/api/games', async (request, reply) => {
  try {
    const data = CreateGameRequestSchema.parse(request.body);
    
    const gameId = generateId();
    const playerId = generateId();
    
    const player: Player = {
      id: playerId,
      name: data.playerName,
      score: 0,
    };
    
    const game: GameState = {
      id: gameId,
      players: [player],
      status: 'waiting',
      currentRound: 0,
      createdAt: new Date().toISOString(),
    };
    
    games.set(gameId, game);
    
    return { game, playerId };
  } catch (error) {
    reply.code(400).send({ error: 'Invalid request data' });
  }
});

// Get game state
fastify.get('/api/games/:gameId', async (request, reply) => {
  const { gameId } = request.params as { gameId: string };
  
  const game = games.get(gameId);
  
  if (!game) {
    reply.code(404).send({ error: 'Game not found' });
    return;
  }
  
  return { game };
});

// Join an existing game
fastify.post('/api/games/join', async (request, reply) => {
  try {
    const data = JoinGameRequestSchema.parse(request.body);
    
    const game = games.get(data.gameId);
    
    if (!game) {
      reply.code(404).send({ error: 'Game not found' });
      return;
    }
    
    if (game.status !== 'waiting') {
      reply.code(400).send({ error: 'Game already started' });
      return;
    }
    
    const playerId = generateId();
    
    const player: Player = {
      id: playerId,
      name: data.playerName,
      score: 0,
    };
    
    game.players.push(player);
    
    return { game, playerId };
  } catch (error) {
    reply.code(400).send({ error: 'Invalid request data' });
  }
});

// Perform game action
fastify.post('/api/games/action', async (request, reply) => {
  try {
    const data = GameActionRequestSchema.parse(request.body);
    
    const game = games.get(data.gameId);
    
    if (!game) {
      reply.code(404).send({ error: 'Game not found' });
      return;
    }
    
    const player = game.players.find(p => p.id === data.playerId);
    
    if (!player) {
      reply.code(404).send({ error: 'Player not found' });
      return;
    }
    
    // Game logic would go here
    // For now, just return the updated game state
    
    return { game };
  } catch (error) {
    reply.code(400).send({ error: 'Invalid request data' });
  }
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
