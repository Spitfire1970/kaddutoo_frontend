import React from 'react';

const ChessLobby = ({
  gameMode,
  setGameMode,
  timeControl,
  setTimeControl,
  createGame,
  waitingGames,
  joinGame,
  playerName,
  globalStats
}) => {
  // Time control options (minutes + increment in seconds)
  const timeControls = [
    { name: '1+0', time: 60, increment: 0 },
    { name: '3+0', time: 180, increment: 0 },
    { name: '3+2', time: 180, increment: 2 },
    { name: '5+0', time: 300, increment: 0 },
    { name: '5+3', time: 300, increment: 3 },
    { name: '10+0', time: 600, increment: 0 },
    { name: '10+5', time: 600, increment: 5 },
    { name: '15+10', time: 900, increment: 10 },
  ];

  // Filter out games created by the current player
  const availableGames = waitingGames.filter(game => game.hostName !== playerName);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Chess Lobby</h2>
      
      <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">Create a New Game</h3>
        
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex-1">
            <h4 className="text-lg mb-2 text-gray-300">Game Mode</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${
                  gameMode === 'standard' 
                    ? 'bg-[#3DD3AE] text-black font-semibold' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                }`}
                onClick={() => setGameMode('standard')}
              >
                Standard Chess
              </button>
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${
                  gameMode === 'chess960' 
                    ? 'bg-[#3DD3AE] text-black font-semibold' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                }`}
                onClick={() => setGameMode('chess960')}
              >
                Chess960
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg mb-2 text-gray-300">Time Control</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {timeControls.map(tc => (
                <button
                  key={tc.name}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    timeControl && timeControl.name === tc.name 
                      ? 'bg-[#3DD3AE] text-black font-semibold' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  }`}
                  onClick={() => setTimeControl({...tc, name: tc.name})}
                >
                  {tc.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          className={`w-full py-2 rounded-md font-semibold transition-colors ${
            !gameMode || !timeControl 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-[#3DD3AE] text-black hover:bg-[#2cb896]'
          }`}
          disabled={!gameMode || !timeControl}
          onClick={createGame}
        >
          Create Game
        </button>
      </div>
      
      <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">Join a Game</h3>
        
        {availableGames.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No games available to join. Create one!</p>
        ) : (
          <div className="space-y-3">
            {availableGames.map(game => (
              <div key={game.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600">
                <div className="flex flex-col">
                  <span className="font-medium text-white">{game.hostName}</span>
                  <div className="flex gap-2 text-sm text-gray-300">
                    <span>{game.mode === 'standard' ? 'Standard' : 'Chess960'}</span>
                    <span>•</span>
                    <span>{game.timeControl.name}</span>
                  </div>
                </div>
                <button 
                  className="px-4 py-1.5 bg-[#3DD3AE] text-black font-semibold rounded-md hover:bg-[#2cb896] transition-colors"
                  onClick={() => joinGame(game.id)}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">Global Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600">
            <span className="text-gray-300">Queens Captured:</span>
            <span className="font-bold text-[#3DD3AE]">{globalStats.capturedQueens}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600">
            <span className="text-gray-300">Pawns Captured:</span>
            <span className="font-bold text-[#3DD3AE]">{globalStats.capturedPawns}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600">
            <span className="text-gray-300">Kings Castled:</span>
            <span className="font-bold text-[#3DD3AE]">{globalStats.castledKings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessLobby; 