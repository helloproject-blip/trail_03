import React, { useState } from 'react';
    import { ALL_OBSTACLES } from './constants';
    import './App.css';

    function App() {
      const [page, setPage] = useState('config');
      const [selectedObstacles, setSelectedObstacles] = useState([]);

      const handleObstacleSelect = (obstacle) => {
        setSelectedObstacles(prev => {
          if (prev.includes(obstacle.id)) {
            return prev.filter(id => id !== obstacle.id);
          }
          return [...prev, obstacle.id];
        });
      };

      const startClass = () => {
        if (selectedObstacles.length < 6 || selectedObstacles.length > 12) {
          alert('Please select between 6 and 12 obstacles');
          return;
        }
        setPage('scoreboard');
      };

      return (
        <div className="scoreboard">
          {page === 'config' ? (
            <div className="config-page">
              <h1>Configure Class Pattern</h1>
              <div className="obstacles-grid">
                {ALL_OBSTACLES.map(obs => (
                  <div
                    key={obs.id}
                    className={`obstacle-card ${
                      selectedObstacles.includes(obs.id) ? 'selected' : ''
                    }`}
                    onClick={() => handleObstacleSelect(obs)}
                  >
                    <i className={`lucide lucide-${obs.icon}`}></i>
                    <span>{obs.name}</span>
                  </div>
                ))}
              </div>
              <div className="selection-info">
                <p>Selected: {selectedObstacles.length} (Min: 6, Max: 12)</p>
                <button 
                  onClick={startClass}
                  disabled={selectedObstacles.length < 6 || selectedObstacles.length > 12}
                >
                  Start Class
                </button>
              </div>
            </div>
          ) : (
            <Scoreboard obstacles={selectedObstacles} />
          )}
        </div>
      );
    }

    function Scoreboard({ obstacles }) {
      const [scores, setScores] = useState(
        obstacles.map(id => ({
          id,
          score: 0,
          penalty: 0
        }))
      );
      const [penaltyTotal, setPenaltyTotal] = useState(0);
      const [finalScore, setFinalScore] = useState(0);

      const calculateTotals = () => {
        const totalPenalty = scores.reduce((sum, obs) => sum + obs.penalty, 0);
        const totalScore = scores.reduce((sum, obs) => sum + obs.score, 0) - totalPenalty;
        setPenaltyTotal(totalPenalty);
        setFinalScore(totalScore);
      };

      const handleScoreChange = (id, type, value) => {
        const updatedScores = scores.map(obs => 
          obs.id === id ? { ...obs, [type]: Number(value) } : obs
        );
        setScores(updatedScores);
        calculateTotals();
      };

      return (
        <>
          <div className="header">
            <h1>Trail Class Scoreboard</h1>
          </div>
          <div className="obstacles-grid">
            {scores.map(obs => {
              const obstacle = ALL_OBSTACLES.find(o => o.id === obs.id);
              return (
                <div key={obs.id} className="obstacle-column">
                  <h3>{obstacle.name}</h3>
                  <div className="score-display">
                    <label>Obstacle Score</label>
                    <LEDDisplay 
                      value={obs.score}
                      onChange={(value) => handleScoreChange(obs.id, 'score', value)}
                    />
                  </div>
                  <div className="score-display">
                    <label>Penalty Score</label>
                    <LEDDisplay 
                      value={obs.penalty}
                      onChange={(value) => handleScoreChange(obs.id, 'penalty', value)}
                      className="penalty"
                    />
                  </div>
                </div>
              );
            })}
            <div className="totals-column">
              <div className="score-display">
                <label>Penalty Total</label>
                <LEDDisplay value={penaltyTotal} readOnly className="penalty" />
              </div>
              <div className="score-display">
                <label>Final Score</label>
                <LEDDisplay value={finalScore} readOnly />
              </div>
            </div>
          </div>
        </>
      );
    }

    function LEDDisplay({ value, onChange, readOnly = false, className = '' }) {
      return (
        <div className={`led-display ${className}`}>
          {readOnly ? (
            <span>{value}</span>
          ) : (
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              min="0"
              max="100"
            />
          )}
        </div>
      );
    }

    export default App;
