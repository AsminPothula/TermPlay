// rooms/SnakeGameRoom.js
const GameRoom = require('./GameRoom');
const fs = require('fs');
const path = require('path');

class SnakeGameRoom extends GameRoom {
  constructor(roomId) {
    super(roomId);
    this.width = 30;
    this.height = 20;

    this.state = {
      snakes: {},
      food: this.spawnFood(),
      boardSize: { width: this.width, height: this.height },
      scores: {},
    };
  }

  addPlayer(playerId, ws) {
    super.addPlayer(playerId, ws);
    this.state.snakes[playerId] = {
      body: [{ x: 5, y: 5 }],
      direction: 'RIGHT',
      alive: true,
    };
    this.state.scores[playerId] = 0;
    // ❌ no more this.inputs[playerId]
  }

  receiveInput(playerId, direction) {
    // Only accept input if snake is alive
    if (!this.state.snakes[playerId]?.alive) return;

    const current = this.state.snakes[playerId].direction;
    const opposites = {
      UP: "DOWN", DOWN: "UP",
      LEFT: "RIGHT", RIGHT: "LEFT"
    };

    if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(direction)) {
      if (current && direction !== opposites[current]) {
        this.state.snakes[playerId].direction = direction;
      }
    }
  }

  update() {
    // 🚩 Skip 'everyone dead' spam if no players yet
    if (Object.keys(this.state.snakes).length === 0) {
      return;
    }

    let allDead = true;

    for (let [playerId, snake] of Object.entries(this.state.snakes)) {
      if (!snake.alive) continue;

      allDead = false;

      const dir = snake.direction;
      const head = { ...snake.body[0] };

      if (dir === 'UP') head.y -= 1;
      if (dir === 'DOWN') head.y += 1;
      if (dir === 'LEFT') head.x -= 1;
      if (dir === 'RIGHT') head.x += 1;

      // Wall collision
      if (head.x < 0 || head.y < 0 || head.x >= this.width || head.y >= this.height) {
        snake.alive = false;
        continue;
      }

      // Self collision
      if (snake.body.some(seg => seg.x === head.x && seg.y === head.y)) {
        snake.alive = false;
        continue;
      }

      // Move
      snake.body.unshift(head);

      if (head.x === this.state.food.x && head.y === this.state.food.y) {
        this.state.scores[playerId] += 1;
        this.state.food = this.spawnFood();
      } else {
        snake.body.pop();
      }
    }

    // Check allDead AFTER moving all players
    if (allDead) {
      const maxScore = Math.max(...Object.values(this.state.scores), 0);
      const winners = Object.entries(this.state.scores)
        .filter(([_, score]) => score === maxScore)
        .map(([id]) => id);

      console.log(`💀 Everyone's dead! Top scorer(s): ${winners.join(', ')}`);

      this.resetGame();
      return;
    }

    // Save replay
    const replayPath = path.resolve(__dirname, '../../replay_data', `${this.roomId}.json`);
    if (!fs.existsSync(replayPath)) fs.writeFileSync(replayPath, '[]');
    const log = JSON.parse(fs.readFileSync(replayPath));
    log.push(JSON.parse(JSON.stringify(this.state)));
    fs.writeFileSync(replayPath, JSON.stringify(log));

    // Broadcast to clients
    super.broadcast({
      type: 'state',
      payload: this.state,
    });
  }

  spawnFood() {
    return {
      x: Math.floor(Math.random() * this.width),
      y: Math.floor(Math.random() * this.height),
    };
  }

  resetGame() {
    for (let playerId of Object.keys(this.state.snakes)) {
      this.state.snakes[playerId] = {
        body: [{ x: 5, y: 5 }],
        direction: 'RIGHT',
        alive: true,
      };
      this.state.scores[playerId] = 0;
    }
    this.state.food = this.spawnFood();

    // Optionally broadcast reset
    super.broadcast({
      type: 'reset',
      payload: this.state,
    });
  }
}

module.exports = SnakeGameRoom;
