import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import { Clock, Users } from 'lucide-react';

// Chess piece components using unicode characters
const Piece = ({ type, color }) => {
  const pieces = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' }
  };
  
  return (
    <div className="text-4xl select-none">
      {pieces[type]?.[color]}
    </div>
  );
};

// Initial board setup
const initialBoard = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  Array(8).fill('pawn'),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill('pawn'),
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
];

const ChessGame = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, ended
  const [timeLeft, setTimeLeft] = useState({ white: 600, black: 600 }); // 10 minutes per player
  const [lastMoveTime, setLastMoveTime] = useState(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8080', {
    onOpen: () => {
      console.log('WebSocket Connected');
    },
    onError: (error) => {
      console.error('WebSocket Error:', error);
    },
    onClose: () => {
      console.log('WebSocket Disconnected');
    },
    shouldReconnect: (closeEvent) => true,
  });

  // ... (Rest of the component remains the sam

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && lastMoveTime) {
      const interval = setInterval(() => {
        setTimeLeft(prev => ({
          ...prev,
          [currentTurn]: Math.max(0, prev[currentTurn] - 1)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentTurn, gameState, lastMoveTime]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      
      switch (data.type) {
        case 'gameStart':
          setPlayerColor(data.color);
          setGameState('playing');
          break;
        case 'move':
          handleMove(data.from, data.to);
          break;
        case 'gameEnd':
          setGameState('ended');
          break;
      }
    }
  }, [lastMessage]);

  // Check if move is valid (simplified chess rules)
  const isValidMove = (from, to) => {
    // Implement chess rules here
    // This is a simplified version - you'd want to add all chess rules
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const piece = board[fromRow][fromCol];
    
    // Basic movement validation
    if (!piece) return false;
    
    // Add more chess rules here (pawn movement, castling, etc.)
    return true;
  };

  const handleSquareClick = (row, col) => {
    if (gameState !== 'playing' || currentTurn !== playerColor) return;

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      
      if (isValidMove([selectedRow, selectedCol], [row, col])) {
        handleMove([selectedRow, selectedCol], [row, col]);
        sendMessage(JSON.stringify({
          type: 'move',
          from: [selectedRow, selectedCol],
          to: [row, col]
        }));
      }
      
      setSelectedSquare(null);
    } else {
      if (board[row][col]) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const handleMove = (from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    setBoard(prev => {
      const newBoard = [...prev.map(row => [...row])];
      newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
      newBoard[fromRow][fromCol] = null;
      return newBoard;
    });
    
    setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
    setLastMoveTime(Date.now());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {/* Game status */}
      <div className="flex items-center space-x-4">
        <Users className="w-6 h-6" />
        <span className="text-lg font-medium">
          {gameState === 'waiting' ? 'Waiting for opponent...' : 
           gameState === 'playing' ? `Your turn: ${currentTurn}` : 
           'Game ended'}
        </span>
      </div>

      {/* Timers */}
      <div className="flex justify-between w-96">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span className="font-mono">White: {formatTime(timeLeft.white)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span className="font-mono">Black: {formatTime(timeLeft.black)}</span>
        </div>
      </div>

      {/* Chess board */}
      <div className="grid grid-cols-8 gap-0 border border-gray-300">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => {
            const isSelected = selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex;
            const squareColor = (rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800';
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-16 h-16 flex items-center justify-center cursor-pointer
                  ${squareColor}
                  ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  ${piece ? 'hover:ring-1 hover:ring-blue-300' : ''}
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <Piece
                    type={piece}
                    color={rowIndex < 2 ? 'black' : 'white'}
                  />
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* Play button */}
      {gameState === 'waiting' && (
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => sendMessage(JSON.stringify({ type: 'joinGame' }))}
        >
          Play Game
        </button>
      )}
    </div>
  );
};

export default ChessGame;