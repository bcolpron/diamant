import { z } from 'zod';

// Player schema
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().default(0),
});

export type Player = z.infer<typeof PlayerSchema>;

// Game state schema
export const GameStateSchema = z.object({
  id: z.string(),
  players: z.array(PlayerSchema),
  status: z.enum(['waiting', 'playing', 'finished']),
  currentRound: z.number().default(0),
  createdAt: z.string().datetime(),
});

export type GameState = z.infer<typeof GameStateSchema>;

// API Request/Response schemas
export const CreateGameRequestSchema = z.object({
  playerName: z.string().min(1).max(50),
});

export type CreateGameRequest = z.infer<typeof CreateGameRequestSchema>;

export const JoinGameRequestSchema = z.object({
  gameId: z.string(),
  playerName: z.string().min(1).max(50),
});

export type JoinGameRequest = z.infer<typeof JoinGameRequestSchema>;

export const GameActionRequestSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  action: z.enum(['collect', 'continue']),
});

export type GameActionRequest = z.infer<typeof GameActionRequestSchema>;
