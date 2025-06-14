// src/components/GameViewer.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function GameViewer({ selectedGame }) {
  const [boardState, setBoardState] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8081");

    socket.on("connect", () => {
      console.log("Connected to game server");
    });

    socket.on("message", (msg) => {
      const data = JSON.parse(msg);
      if (data.type === "state" && selectedGame === "snake") {
        setBoardState(data.payload);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedGame]);

  if (selectedGame !== "snake") {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Live view for {selectedGame} (coming soon...)
      </div>
    );
  }

  if (!boardState) {
    return <div>Loading snake game...</div>;
  }

  const boardW = boardState.boardSize.width;
  const boardH = boardState.boardSize.height;

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${boardW}, 20px)` }}>
      {Array.from({ length: boardH }).map((_, y) =>
        Array.from({ length: boardW }).map((_, x) => {
          const isSnake = Object.values(boardState.snakes).some((snake) =>
            snake.body.some((seg) => seg.x === x && seg.y === y)
          );
          const isFood = boardState.food.x === x && boardState.food.y === y;

          return (
            <div
              key={`${x}-${y}`}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: isSnake
                  ? "limegreen"
                  : isFood
                  ? "red"
                  : "#222",
                border: "1px solid #333",
              }}
            />
          );
        })
      )}
    </div>
  );
}
