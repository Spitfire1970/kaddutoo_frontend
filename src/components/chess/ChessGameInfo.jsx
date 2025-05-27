import React, { useEffect, useState, useRef } from 'react';

const ChessGameInfo = ({
  playerName,
  opponentName,
  playerColor,
  timeLeft,
  isPlayerTurn,
  gameStats,
  offerDraw,
  acceptDraw,
  declineDraw,
  resign,
  drawOfferReceived
}) => {
  const [localTimeLeft, setLocalTimeLeft] = useState(timeLeft);
  const [drawOfferPending, setDrawOfferPending] = useState(false);
  const timerRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const activePlayerRef = useRef(isPlayerTurn ? playerColor : (playerColor === 'white' ? 'black' : 'white'));
  const opponentJoinedRef = useRef(!!opponentName);
  const gameActiveRef = useRef(!!opponentName);
  
  // Update local time whenever server sends new time values
  useEffect(() => {
    if (timeLeft) {
      setLocalTimeLeft(timeLeft);
      lastUpdateRef.current = Date.now();
    }
  }, [timeLeft]);
  
  // Update opponent joined status
  useEffect(() => {
    if (opponentName) {
      opponentJoinedRef.current = true;
      gameActiveRef.current = true;
    }
  }, [opponentName]);
  
  // Update active player reference when turn changes
  useEffect(() => {
    activePlayerRef.current = isPlayerTurn ? playerColor : (playerColor === 'white' ? 'black' : 'white');
  }, [isPlayerTurn, playerColor]);
  
  // Update local time for the active player and check for timeout
  useEffect(() => {
    // Clear any existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Only start the timer if both players have joined and the game is active
    if (opponentJoinedRef.current && gameActiveRef.current) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - lastUpdateRef.current) / 1000;
        
        setLocalTimeLeft(prev => {
          if (!prev) return prev;
          
          // Only decrement time for the active player
          const activePlayer = activePlayerRef.current;
          
          // Use a more precise calculation that doesn't round down to whole seconds
          // This prevents the visual timer from getting ahead of the server
          const newTime = Math.max(0, prev[activePlayer] - elapsed);
          
          // Update the lastUpdateRef for the next interval
          lastUpdateRef.current = now;
          
          // Only trigger resignation if time is very close to zero (less than 0.1 seconds)
          // This prevents premature timeout notifications
          if (newTime < 0.1 && prev[activePlayer] > 0.1) {
            if (activePlayer === playerColor && gameActiveRef.current) {
              clearInterval(timerRef.current);
              setTimeout(() => resign('timeout'), 100);
            }
          }
          
          return {
            ...prev,
            [activePlayer]: newTime
          };
        });
      }, 100); // Update more frequently (10 times per second) for smoother countdown
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlayerTurn, opponentName, playerColor, resign]);
  
  // Handle draw offer received
  useEffect(() => {
    if (drawOfferReceived) {
      setDrawOfferPending(false);
    }
  }, [drawOfferReceived]);
  
  // Stop timer when game ends
  useEffect(() => {
    return () => {
      gameActiveRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const formatTime = (seconds) => {
    if (seconds === undefined) return '00:00';
    // Round to nearest tenth of a second to prevent visual jumping
    const roundedSeconds = Math.ceil(seconds * 10) / 10;
    const mins = Math.floor(roundedSeconds / 60);
    const secs = Math.floor(roundedSeconds % 60);
    const tenths = Math.floor((roundedSeconds * 10) % 10);
    
    // Only show tenths of a second when under 10 seconds
    if (roundedSeconds < 10) {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
    }
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleDrawOffer = () => {
    if (!drawOfferPending && opponentName && gameActiveRef.current) {
      offerDraw();
      setDrawOfferPending(true);
    }
  };
  
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md shadow-[#3DD3AE]/10 flex flex-col gap-4 mb-4 border border-gray-800">
      <div className="flex justify-between items-center">
        <div className="text-lg text-white">{opponentName || 'Waiting for opponent...'}</div>
        <div className={`font-mono text-2xl px-3 py-1 rounded ${!isPlayerTurn && opponentName ? 'bg-[#3DD3AE] text-black font-bold' : 'bg-gray-800 text-gray-300'}`}>
          {formatTime(localTimeLeft && localTimeLeft[playerColor === 'white' ? 'black' : 'white'])}
        </div>
      </div>
      
      {drawOfferReceived && (
        <div className="bg-gray-800 text-white p-3 rounded-md flex justify-between items-center border border-[#3DD3AE]">
          <span>{opponentName} offered a draw</span>
          <div className="flex gap-2">
            <button 
              className="bg-[#3DD3AE] hover:bg-[#2cb896] text-black font-bold px-3 py-1 rounded"
              onClick={acceptDraw}
            >
              Accept
            </button>
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
              onClick={declineDraw}
            >
              Decline
            </button>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        <button 
          className={`flex-1 py-2 rounded-md transition-colors ${
            drawOfferPending || !opponentName
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-800 text-white hover:bg-gray-700 border border-[#3DD3AE]'
          }`}
          onClick={handleDrawOffer}
          disabled={drawOfferPending || !opponentName}
        >
          {!opponentName ? 'Waiting for opponent' : drawOfferPending ? 'Draw Offered' : 'Offer Draw'}
        </button>
        <button 
          className={`flex-1 py-2 rounded-md transition-colors ${
            !opponentName
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-red-500'
          }`}
          onClick={() => resign('resigned')}
          disabled={!opponentName}
        >
          Resign
        </button>
      </div>
      
      <div className="bg-gray-800 p-3 rounded-md space-y-2 border border-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-400">Queens Captured:</span>
          <span className="font-bold text-[#3DD3AE]">{gameStats.capturedQueens}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Pawns Captured:</span>
          <span className="font-bold text-[#3DD3AE]">{gameStats.capturedPawns}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Kings Castled:</span>
          <span className="font-bold text-[#3DD3AE]">{gameStats.castledKings}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className={`font-mono text-2xl px-3 py-1 rounded ${isPlayerTurn && opponentName ? 'bg-[#3DD3AE] text-black font-bold' : 'bg-gray-800 text-gray-300'}`}>
          {formatTime(localTimeLeft && localTimeLeft[playerColor])}
        </div>
        <div className="text-lg text-white">
          {playerName} ({playerColor})
          {isPlayerTurn && opponentName && <span className="ml-2 text-[#3DD3AE]">- Your turn</span>}
        </div>
      </div>
    </div>
  );
};

export default ChessGameInfo; 