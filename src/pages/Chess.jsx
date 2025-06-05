import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import ChessBoard from '../components/chess/ChessBoard';
import ChessLobby from '../components/chess/ChessLobby';
import ChessGameInfo from '../components/chess/ChessGameInfo';

const Chess = () => {
  const [guestName, setGuestName] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [gameMode, setGameMode] = useState(null); // 'standard' or 'chess960'
  const [timeControl, setTimeControl] = useState(null);
  const [inGame, setInGame] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [position, setPosition] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [waitingGames, setWaitingGames] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameStats, setGameStats] = useState({
    capturedQueens: 0,
    capturedPawns: 0,
    castledKings: 0,
  });
  const [globalStats, setGlobalStats] = useState({
    capturedQueens: 0,
    capturedPawns: 0,
    castledKings: 0,
  });
  const [timeLeft, setTimeLeft] = useState({ white: 0, black: 0 });
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [drawOfferReceived, setDrawOfferReceived] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  
  // WebSocket connection
  const socketUrl = import.meta.env.MODE === 'production' 
    ? 'wss://nakul.one/chess-ws'
    : 'ws://localhost:3001/chess-ws';
  
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection established'),
    onError: (event) => console.error('WebSocket error:', event),
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  // Reset game state
  const resetGameState = () => {
    setInGame(false);
    setGameId(null);
    setPosition(null);
    setPlayerColor(null);
    setOpponent(null);
    setSelectedPiece(null);
    setDrawOfferReceived(false);
    setIsPlayerTurn(false);
    setGameStats({
      capturedQueens: 0,
      capturedPawns: 0,
      castledKings: 0,
    });
    setGameResult(null);
  };

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastJsonMessage) {
      const { type, data } = lastJsonMessage;
      
      switch (type) {
        case 'waiting_games':
          setWaitingGames(data.games);
          if (data.globalStats) {
            setGlobalStats(data.globalStats);
          }
          break;
        case 'game_created':
          setGameId(data.gameId);
          setPlayerColor(data.color);
          setPosition(data.position);
          setTimeLeft(data.timeControl);
          setInGame(true);
          setGameResult(null);
          break;
        case 'game_joined':
          setGameId(data.gameId);
          setPlayerColor(data.color);
          setPosition(data.position);
          setOpponent(data.opponent);
          setTimeLeft(data.timeControl);
          setInGame(true);
          setIsPlayerTurn(data.color === 'white');
          setGameResult(null);
          break;
        case 'opponent_joined':
          setOpponent(data.opponent);
          // Update time control if provided
          if (data.timeControl) {
            setTimeLeft(data.timeControl);
          }
          // If player is white, they go first
          if (playerColor === 'white') {
            setIsPlayerTurn(true);
          }
          break;
        case 'move_made':
          setPosition(data.position);
          // Ensure timeLeft is properly updated with the server values
          if (data.timeLeft) {
            setTimeLeft(data.timeLeft);
          }
          setIsPlayerTurn(data.nextTurn === playerColor);
          // Update stats if needed
          if (data.stats) {
            setGameStats(prevStats => ({
              ...prevStats,
              ...data.stats
            }));
          }
          break;
        case 'draw_offered':
          setDrawOfferReceived(true);
          break;
        case 'draw_declined':
          alert('Draw offer declined');
          break;
        case 'game_over':
          setGameResult(data.result);
          // Don't show alert for timeout if it's the player's own timeout
          if (!data.result.toLowerCase().includes('time') || !isPlayerTurn) {
            alert(`Game over: ${data.result}`);
          }
          // Don't reset the game state immediately to allow the player to see the final position
          setTimeout(() => {
            resetGameState();
            // Request waiting games after a game ends
            sendJsonMessage({
              type: 'get_waiting_games',
            });
          }, 1000);
          break;
        case 'error':
          console.error('Server error:', data.message);
          alert(`Error: ${data.message}`);
          break;
        default:
          console.log('Unknown message type:', type);
      }
    }
  }, [lastJsonMessage, playerColor, sendJsonMessage, isPlayerTurn]);

  // Request waiting games when name is entered
  useEffect(() => {
    if (isNameEntered) {
      sendJsonMessage({
        type: 'get_waiting_games',
      });
      
      // Set up polling for waiting games
      const interval = setInterval(() => {
        if (!inGame) {
          sendJsonMessage({
            type: 'get_waiting_games',
          });
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isNameEntered, sendJsonMessage, inGame]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (guestName.trim()) {
      setIsNameEntered(true);
      sendJsonMessage({
        type: 'register',
        data: { name: guestName }
      });
    }
  };

  const createGame = () => {
    if (!gameMode || !timeControl) return;
    
    sendJsonMessage({
      type: 'create_game',
      data: {
        mode: gameMode,
        timeControl: timeControl,
        playerName: guestName
      }
    });
  };

  const joinGame = (gameId) => {
    sendJsonMessage({
      type: 'join_game',
      data: {
        gameId,
        playerName: guestName
      }
    });
  };

  const makeMove = (from, to) => {
    if (!isPlayerTurn || gameResult) return;
    
    sendJsonMessage({
      type: 'make_move',
      data: {
        gameId,
        from,
        to,
        playerColor
      }
    });
  };

  const handlePieceClick = (square) => {
    if (!isPlayerTurn || gameResult) return;
    
    // If no piece is selected and the clicked square has a piece of the player's color, select it
    if (!selectedPiece) {
      const piece = position[square];
      if (piece && piece.color === playerColor) {
        setSelectedPiece(square);
      }
    } 
    // If a piece is already selected
    else {
      // If clicking the same square, deselect
      if (selectedPiece === square) {
        setSelectedPiece(null);
      } 
      // If clicking a different square, try to make a move
      else {
        makeMove(selectedPiece, square);
        setSelectedPiece(null);
      }
    }
  };

  const offerDraw = () => {
    if (gameResult) return;
    
    sendJsonMessage({
      type: 'offer_draw',
      data: { gameId, playerColor }
    });
  };
  
  const acceptDraw = () => {
    if (gameResult) return;
    
    sendJsonMessage({
      type: 'accept_draw',
      data: { gameId, playerColor }
    });
    setDrawOfferReceived(false);
  };
  
  const declineDraw = () => {
    if (gameResult) return;
    
    sendJsonMessage({
      type: 'decline_draw',
      data: { gameId, playerColor }
    });
    setDrawOfferReceived(false);
  };

  const resign = (reason = 'resigned') => {
    if (gameResult) return;
    
    if (reason === 'timeout' || window.confirm('Are you sure you want to resign?')) {
      sendJsonMessage({
        type: 'resign',
        data: { gameId, playerColor }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white">
      {!isNameEntered ? (
        <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome to Chess</h2>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />
            <button 
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      ) : !inGame ? (
        <ChessLobby
          gameMode={gameMode}
          setGameMode={setGameMode}
          timeControl={timeControl}
          setTimeControl={setTimeControl}
          createGame={createGame}
          waitingGames={waitingGames}
          joinGame={joinGame}
          playerName={guestName}
          globalStats={globalStats}
        />
      ) : (
        <div className="space-y-4">
          <ChessGameInfo
            playerName={guestName}
            opponentName={opponent}
            playerColor={playerColor}
            timeLeft={timeLeft}
            isPlayerTurn={isPlayerTurn}
            gameStats={gameStats}
            offerDraw={offerDraw}
            acceptDraw={acceptDraw}
            declineDraw={declineDraw}
            resign={resign}
            drawOfferReceived={drawOfferReceived}
          />
          <div className="max-w-xl mx-auto">
            <ChessBoard
              position={position}
              playerColor={playerColor}
              selectedPiece={selectedPiece}
              onSquareClick={handlePieceClick}
            />
          </div>
          {gameResult && (
            <div className="p-3 bg-gray-800 text-white rounded-md text-center border border-[#3DD3AE]">
              <p className="font-bold">Game Over: {gameResult}</p>
              <button 
                className="mt-2 px-4 py-2 bg-[#3DD3AE] text-black rounded-md hover:bg-[#2cb896]"
                onClick={resetGameState}
              >
                Return to Lobby
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chess; 