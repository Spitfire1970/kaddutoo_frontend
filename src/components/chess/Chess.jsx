import React, { useEffect, useState } from 'react';
import chess from 'chess.js';

const Chess = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [position, setPosition] = useState(chess().board());
  const [playerColor, setPlayerColor] = useState('w');
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ w: 120, b: 120 });
  const [gameId, setGameId] = useState('');

  const handleSquareClick = (square) => {
    if (!isMyTurn) return;

    if (selectedPiece) {
      // Attempt to make a move
      const move = {
        from: selectedPiece,
        to: square,
        playerColor: playerColor
      };

      // If clicking the same square, deselect it
      if (square === selectedPiece) {
        setSelectedPiece(null);
        return;
      }

      // Check if move is legal using chess.js
      const moveAttempt = chess.move({
        from: selectedPiece,
        to: square,
        promotion: 'q' // Always promote to queen for simplicity
      });

      // If move is illegal, just deselect if clicking a different square
      if (!moveAttempt) {
        // Only deselect if clicking an empty square or opponent's piece
        const pieceAtSquare = position[square];
        if (!pieceAtSquare || pieceAtSquare.color !== playerColor) {
          setSelectedPiece(null);
        } else {
          // If clicking own piece, select it instead
          setSelectedPiece(square);
        }
        return;
      }

      // Undo the move in chess.js since we'll let the server handle it
      chess.undo();

      // Send move to server
      sendMessage({
        type: 'make_move',
        data: move
      });

      setSelectedPiece(null);
    } else {
      // Check if the clicked square has a piece of the player's color
      const piece = position[square];
      if (piece && piece.color === playerColor) {
        setSelectedPiece(square);
      }
    }
  };

  // Update the timer effect to end the game when time runs out
  useEffect(() => {
    if (!isGameStarted || !timeLeft || !isMyTurn) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = {
          ...prev,
          [playerColor]: Math.max(0, prev[playerColor] - 1)
        };

        // Check if time has run out
        if (newTime[playerColor] <= 0) {
          // Send resignation to server to handle game end
          sendMessage({
            type: 'resign',
            data: { gameId }
          });
          clearInterval(timer);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, timeLeft, isMyTurn, playerColor, gameId]);

  return (
    // Render your component code here
  );
};

export default Chess; 