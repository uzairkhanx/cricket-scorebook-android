import { useState } from "react";

type TossProps = {
  teamA: string;
  teamB: string;
  onStartMatch: (
    tossWinner: string,
    decision: "bat" | "bowl"
  ) => void;
};

function Toss({ teamA, teamB, onStartMatch }: TossProps) {
  const [tossWinner, setTossWinner] = useState("");
  const [decision, setDecision] = useState<"bat" | "bowl" | "">("");

  const handleStart = () => {
    if (!tossWinner) {
      alert("Please select the toss winner.");
      return;
    }

    if (!decision) {
      alert("Please select Bat First or Bowl First.");
      return;
    }

    onStartMatch(tossWinner, decision);
  };

  return (
    <div className="toss-page">
      <div className="toss-header">
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back
        </button>

        <div>
          <h1>🏏 Match Toss</h1>
          <p>Set the toss result before starting the match</p>
        </div>
      </div>

      <div className="toss-card">
        <h2>Who won the toss?</h2>

        <div className="toss-teams">
          <button
            className={`toss-team ${
              tossWinner === teamA ? "selected" : ""
            }`}
            onClick={() => setTossWinner(teamA)}
          >
            <span>🏏</span>
            <strong>{teamA}</strong>
            <small>{tossWinner === teamA ? "✓ Toss Winner" : "Select"}</small>
          </button>

          <div className="vs">VS</div>

          <button
            className={`toss-team ${
              tossWinner === teamB ? "selected" : ""
            }`}
            onClick={() => setTossWinner(teamB)}
          >
            <span>🏏</span>
            <strong>{teamB}</strong>
            <small>{tossWinner === teamB ? "✓ Toss Winner" : "Select"}</small>
          </button>
        </div>
      </div>

      {tossWinner && (
        <div className="toss-card">
          <h2>{tossWinner} won the toss</h2>
          <p className="decision-text">What do they want to do?</p>

          <div className="decision-buttons">
            <button
              className={`decision-button ${
                decision === "bat" ? "selected" : ""
              }`}
              onClick={() => setDecision("bat")}
            >
              🏏
              <strong>Bat First</strong>
              <small>Start the innings</small>
            </button>

            <button
              className={`decision-button ${
                decision === "bowl" ? "selected" : ""
              }`}
              onClick={() => setDecision("bowl")}
            >
              ⚾
              <strong>Bowl First</strong>
              <small>Field first</small>
            </button>
          </div>
        </div>
      )}

      {tossWinner && decision && (
        <div className="toss-summary">
          <div>
            <span>Toss Winner</span>
            <strong>{tossWinner}</strong>
          </div>

          <div>
            <span>Decision</span>
            <strong>
              {decision === "bat" ? "Bat First 🏏" : "Bowl First ⚾"}
            </strong>
          </div>
        </div>
      )}

      <button
        className="start-match-button"
        disabled={!tossWinner || !decision}
        onClick={handleStart}
      >
        Start Match →
      </button>
    </div>
  );
}

export default Toss;