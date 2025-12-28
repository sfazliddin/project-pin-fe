import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function App() {
  const [gameId, setGameId] = useState(null);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [error, setError] = useState(null);

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
      setError(null);
      const response = await axios.post(`http://localhost:8080/api/game/${gameId}/guess`, {
        guess
      });

      setResult(response.data);
      setHistory((prevHistory) => [...prevHistory, response.data]);



      if (response.data.win === true) {
        setIsWon(true);
      }

      setGuess('');


    } catch (error) {
      console.error('Error making guess: ', error);
      setError(error.response?.data?.message || 'Invalid guess format');
    }




  };

  return (
    <div className="App">
      <h1>Project Pin</h1>

      {/* TODO: Add UI elements */}
      {/* Start Game Button */}

      <Button variant='contained' onClick={startNewGame}>Start Game</Button>

      {/* Guess Input + Submit Button */}
      {gameId && (
        <div>

          <TextField
            required
            id='guess'
            label='Enter your guess'
            // defaultValue={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                makeGuess();
              }
            }}
            disabled={isWon}
            value={guess}
          />


          <Button variant='contained' onClick={makeGuess} disabled={isWon}>Submit Guess</Button>

        </div>
      )}
      {error && (
        <div style={{ color: 'red', margin: '10px' }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <p>Guess: {result.guess} | Bulls: {result.bulls} | Cows: {result.cows}</p>
        </div>
      )}

      {/* Guess History */}
      {gameId && !isWon && (
        <p>Attempts: {history.length}</p>
      )}
      {history.length > 0 && (
        // <ul>
        //   {history.map((g, index) => (
        //     <li key={index}>
        //       {g.guess} → Bulls: {g.bulls}, Cows: {g.cows}
        //     </li>
        //   ))}
        // </ul>
        <List>
          {history.map((g, index) => (
            <ListItem key={index} >
              <ListItemText
                primary={`${g.guess} → Bulls: ${g.bulls}, Cows: ${g.cows}`}
              />
            </ListItem>
          ))}
        </List>

      )}

      {/* Win Message */}
      {isWon && <h3>You won the game!</h3>}

    </div>
  );
}

export default App;