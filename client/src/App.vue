<script setup lang="ts">
import { ref } from 'vue';
import type { GameState } from '@diamant/shared';

const API_URL = 'http://localhost:3001';

const playerName = ref('');
const gameId = ref('');
const playerId = ref('');
const currentGame = ref<GameState | null>(null);
const error = ref('');
const view = ref<'menu' | 'create' | 'join' | 'game'>('menu');

async function createGame() {
  if (!playerName.value.trim()) {
    error.value = 'Please enter your name';
    return;
  }

  try {
    error.value = '';
    const response = await fetch(`${API_URL}/api/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName: playerName.value }),
    });

    if (!response.ok) {
      throw new Error('Failed to create game');
    }

    const data = await response.json();
    currentGame.value = data.game;
    playerId.value = data.playerId;
    gameId.value = data.game.id;
    view.value = 'game';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create game';
  }
}

async function joinGame() {
  if (!playerName.value.trim() || !gameId.value.trim()) {
    error.value = 'Please enter your name and game ID';
    return;
  }

  try {
    error.value = '';
    const response = await fetch(`${API_URL}/api/games/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: gameId.value,
        playerName: playerName.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to join game');
    }

    const data = await response.json();
    currentGame.value = data.game;
    playerId.value = data.playerId;
    view.value = 'game';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to join game';
  }
}

async function testConnection() {
  try {
    error.value = '';
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      throw new Error('Server not responding');
    }
    const data = await response.json();
    error.value = `Server OK - ${data.status}`;
  } catch (err) {
    error.value = 'Cannot connect to server. Make sure it is running on port 3001';
  }
}

function goToMenu() {
  view.value = 'menu';
  error.value = '';
}

function goToCreate() {
  view.value = 'create';
  error.value = '';
}

function goToJoin() {
  view.value = 'join';
  error.value = '';
}
</script>

<template>
  <div>
    <h1>💎 Diamant Game</h1>

    <div v-if="view === 'menu'" class="card">
      <h2>Main Menu</h2>
      <div>
        <button @click="goToCreate">Create New Game</button>
      </div>
      <div>
        <button @click="goToJoin">Join Existing Game</button>
      </div>
      <div>
        <button @click="testConnection">Test Server Connection</button>
      </div>
    </div>

    <div v-if="view === 'create'" class="card">
      <h2>Create New Game</h2>
      <div>
        <input v-model="playerName" placeholder="Enter your name" @keyup.enter="createGame" />
      </div>
      <div>
        <button @click="createGame">Create Game</button>
        <button @click="goToMenu">Back</button>
      </div>
    </div>

    <div v-if="view === 'join'" class="card">
      <h2>Join Game</h2>
      <div>
        <input v-model="playerName" placeholder="Enter your name" />
      </div>
      <div>
        <input v-model="gameId" placeholder="Enter game ID" @keyup.enter="joinGame" />
      </div>
      <div>
        <button @click="joinGame">Join Game</button>
        <button @click="goToMenu">Back</button>
      </div>
    </div>

    <div v-if="view === 'game' && currentGame" class="card">
      <h2>Game: {{ currentGame.id }}</h2>
      <p><strong>Status:</strong> {{ currentGame.status }}</p>
      <p><strong>Round:</strong> {{ currentGame.currentRound }}</p>
      
      <h3>Players</h3>
      <div v-for="player in currentGame.players" :key="player.id" class="card">
        <span :style="{ fontWeight: player.id === playerId ? 'bold' : 'normal' }">
          {{ player.name }} 
          <span v-if="player.id === playerId">(You)</span>
          - Score: {{ player.score }}
        </span>
      </div>
      
      <div>
        <button @click="goToMenu">Leave Game</button>
      </div>
    </div>

    <p v-if="error" :style="{ color: error.includes('OK') ? 'green' : 'red' }">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3em;
  margin-bottom: 0.5em;
}

button {
  margin: 0.5em;
}
</style>
