import { useState } from "react";

type OpeningSetupProps = {
  battingTeam: string;
  bowlingTeam: string;
  battingPlayers: string[];
  bowlingPlayers: string[];
  onBack: () => void;
  onStartScoring: (
    striker: string,
    nonStriker: string,
    bowler: string
  ) => void;
};

function OpeningSetup({
  battingTeam,
  bowlingTeam,
  battingPlayers,
  bowlingPlayers,
  onBack,
  onStartScoring,
}: OpeningSetupProps) {
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [bowler, setBowler] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!striker || !nonStriker || !bowler) {
      setError("Please select both opening batters and the opening bowler.");
      return;
    }

    if (striker === nonStriker) {
      setError("Striker and non-striker must be different players.");
      return;
    }

    onStartScoring(striker, nonStriker, bowler);
  };

  return (
    <div className="opening-page">
      <div className="opening-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Toss
        </button>

        <div>
          <h1>🏏 Opening Players</h1>
          <p>Select the players who will start the innings.</p>
        </div>
      </div>

      <div className="innings-teams">
        <div className="innings-team batting">
          <span>BATTING</span>
          <strong>{battingTeam}</strong>
        </div>

        <div className="innings-vs">VS</div>

        <div className="innings-team bowling">
          <span>BOWLING</span>
          <strong>{bowlingTeam}</strong>
        </div>
      </div>

      <div className="opening-grid">
        <section className="opening-card">
          <div className="opening-card-title">
            <span>🏏</span>

            <div>
              <h2>Opening Batters</h2>
              <p>{battingTeam}</p>
            </div>
          </div>

          <div className="opening-field">
  <label>Striker</label>

  <select
    value={striker}
    onChange={(e) => setStriker(e.target.value)}
  >
    <option value="">Select striker</option>

    {battingPlayers.map((player) => (
      <option key={player} value={player}>
        {player}
      </option>
    ))}
  </select>

  <small>This batter will face the first ball.</small>
</div>

          <div className="opening-field">
  <label>Non-Striker</label>

  <select
    value={nonStriker}
    onChange={(e) => setNonStriker(e.target.value)}
  >
    <option value="">Select non-striker</option>

    {battingPlayers
      .filter((player) => player !== striker)
      .map((player) => (
        <option key={player} value={player}>
          {player}
        </option>
      ))}
  </select>

  <small>This batter will start at the other end.</small>
</div>
        </section>

        <section className="opening-card">
          <div className="opening-card-title">
            <span>⚾</span>

            <div>
              <h2>Opening Bowler</h2>
              <p>{bowlingTeam}</p>
            </div>
          </div>

          <div className="opening-field">
  <label>Bowler</label>

  <select
    value={bowler}
    onChange={(e) => setBowler(e.target.value)}
  >
    <option value="">Select opening bowler</option>

    {bowlingPlayers.map((player) => (
      <option key={player} value={player}>
        {player}
      </option>
    ))}
  </select>

  <small>This player will bowl the first over.</small>
</div>
        </section>
      </div>

      {striker && nonStriker && bowler && (
        <div className="opening-summary">
          <div>
            <span>STRIKER</span>
            <strong>{striker}</strong>
          </div>

          <div>
            <span>NON-STRIKER</span>
            <strong>{nonStriker}</strong>
          </div>

          <div>
            <span>BOWLER</span>
            <strong>{bowler}</strong>
          </div>
        </div>
      )}

      {error && <div className="error-message">⚠️ {error}</div>}

      <button className="start-match-button" onClick={handleStart}>
        START SCORING →
      </button>
    </div>
  );
}

export default OpeningSetup;