import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Button, Container, Box, Typography } from '@mui/material';

function App() {
  const [gameId, setGameId] = useState(null);
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);

  const startNewGame = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/game/start');
      setGameId(response.data.gameId);
      setHistory([]);
      setIsWon(false);
      setGuess('');
      setError(null);
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start game');
    }
  };

  const makeGuess = async () => {
    if (guess.length !== 4) {
      triggerShake();
      return;
    }

    try {
      setError(null);
      const response = await axios.post(`http://localhost:8080/api/game/${gameId}/guess`, {
        guess
      });

      setHistory((prevHistory) => [...prevHistory, response.data]);

      if (response.data.win === true) {
        setIsWon(true);
      }

      setGuess('');
    } catch (error) {
      console.error('Error making guess: ', error);
      setError('Invalid guess');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleKeyPress = (e) => {
    if (isWon) return;

    if (e.key === 'Enter') {
      makeGuess();
    } else if (e.key === 'Backspace') {
      setGuess(guess.slice(0, -1));
    } else if (/^[0-9]$/.test(e.key) && guess.length < 4) {
      setGuess(guess + e.key);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [guess, isWon]);

  return (
    <div className="App">
      <Container maxWidth="sm">
        <Box className="game-container">
          {/* Header */}
          <header className="header">
            <Typography variant="h4" className="title">
              BULLS
            </Typography>
            <Typography variant="caption" className="subtitle">
              Guess the 4-digit number
            </Typography>
          </header>

          {/* Game Board */}
          {gameId && (
            <Box className="board">
              {/* Previous Guesses */}
              {history.map((result, rowIndex) => (
                <Box key={rowIndex} className="guess-row">
                  {result.guess.split('').map((digit, colIndex) => (
                    <Box key={colIndex} className="tile tile-filled">
                      {digit}
                    </Box>
                  ))}
                  <Box className="feedback">
                    <span className="bulls-count">{result.bulls}🎯</span>
                    <span className="cows-count">{result.cows}🔄</span>
                  </Box>
                </Box>
              ))}

              {/* Current Guess Row */}
              {!isWon && (
                <Box className={`guess-row current-row ${shake ? 'shake' : ''}`}>
                  {[0, 1, 2, 3].map((index) => (
                    <Box
                      key={index}
                      className={`tile ${guess[index] ? 'tile-active' : ''}`}
                    >
                      {guess[index] || ''}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Empty Rows */}
              {!isWon && Array(Math.max(0, 5 - history.length - 1)).fill(0).map((_, rowIndex) => (
                <Box key={`empty-${rowIndex}`} className="guess-row">
                  {[0, 1, 2, 3].map((colIndex) => (
                    <Box key={colIndex} className="tile tile-empty"></Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Box className="error-message">
              {error}
            </Box>
          )}

          {/* Win Message */}
          {isWon && (
            <Box className="win-message">
              <Typography variant="h5">🎉 Genius!</Typography>
              <Typography variant="body1">
                You solved it in {history.length} {history.length === 1 ? 'try' : 'tries'}
              </Typography>
            </Box>
          )}

          {/* Instructions */}
          {gameId && !isWon && (
            <Box className="instructions">
              <Typography variant="body2">
                🎯 Bulls = correct digit in correct position
              </Typography>
              <Typography variant="body2">
                🔄 Cows = correct digit in wrong position
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box className="actions">
            {!gameId ? (
              <Button
                variant="contained"
                size="large"
                onClick={startNewGame}
                className="start-button"
              >
                Start Game
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={makeGuess}
                  disabled={isWon || guess.length !== 4}
                  className="guess-button"
                >
                  Enter
                </Button>
                <Button
                  variant="outlined"
                  onClick={startNewGame}
                  className="new-game-button"
                >
                  New Game
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;