import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [gameId, setGameId] = useState(null);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);

  const startNewGame = async () => {
    // TODO: Call API to start game
    try {
      const response = await axios.post('http://localhost:8080/api/game/start');
      setGameId(response.data.gameId);
      setHistory([]);
      setResult(null);
      setIsWon(false);
      setGuess('');
      console.log(response.data);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const makeGuess = async () => {

    // TODO: Call API to make guess
    try {
      const response = await axios.post(`http://localhost:8080/api/game/${gameId}/guess`, {
        guess
      });
      console.log('RESPONSE DATA:', response.data);
      setResult(response.data);
      console.log('HISTORY:', history);


      setHistory((prevHistory) => [...prevHistory, response.data]);

      console.log('HISTORY:', history);

      if (response.data.win === true) {
        setIsWon(true);
      }

      setGuess('');


    } catch (error) {
      console.error('Error making guess: ', error);
    }




  };

  return (
    <div className="App">
      <h1>Project Pin</h1>

      {/* TODO: Add UI elements */}
      {/* Start Game Button */}
      <button onClick={startNewGame}>
        Start Game
      </button>

      {/* Guess Input + Submit Button */}
      {gameId && (
        <div>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            disabled={isWon}
          />

          <button onClick={makeGuess} disabled={isWon}>
            Submit Guess
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <p>Guess: {result.guess} | Bulls: {result.bulls} | Cows: {result.cows}</p>
        </div>
      )}

      {/* Guess History */}
      {history.length > 0 && (
        <ul>
          {history.map((g, index) => (
            <li key={index}>
              {g.guess} → Bulls: {g.bulls}, Cows: {g.cows}
            </li>
          ))}
        </ul>

      )}

      {/* Win Message */}
      {isWon && <h3>You won the game!</h3>}

    </div>
  );
}

export default App;