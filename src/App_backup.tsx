import { useState } from "react";
import "./App.css";

type MatchSetup = {
  matchName: string;
  team1: string;
  team2: string;
  overs: number;
  playersPerTeam: number;
};

function App() {
  const [screen, setScreen] = useState<
    "home" | "create-match" | "players" | "match-ready"
  >("home");

  const [match, setMatch] = useState<MatchSetup>({
    matchName: "",
    team1: "",
    team2: "",
    overs: 10,
    playersPerTeam: 11,
  });

  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);

  const [error, setError] = useState("");

  const updateMatch = (
    field: keyof MatchSetup,
    value: string | number
  ) => {
    setMatch((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const startPlayerSetup = () => {
    if (!match.team1.trim() || !match.team2.trim()) {
      setError("Please enter both team names.");
      return;
    }

    if (
      match.team1.trim().toLowerCase() ===
      match.team2.trim().toLowerCase()
    ) {
      setError("Team 1 and Team 2 must have different names.");
      return;
    }

    if (match.overs < 1) {
      setError("Overs must be at least 1.");
      return;
    }

    if (match.playersPerTeam < 1 || match.playersPerTeam > 16) {
      setError("Players per team must be between 1 and 16.");
      return;
    }

    setTeam1Players(
      Array.from(
        { length: match.playersPerTeam },
        (_, index) => team1Players[index] || ""
      )
    );

    setTeam2Players(
      Array.from(
        { length: match.playersPerTeam },
        (_, index) => team2Players[index] || ""
      )
    );

    setScreen("players");
  };

  const updatePlayer = (
    team: 1 | 2,
    index: number,
    value: string
  ) => {
    if (team === 1) {
      setTeam1Players((previous) => {
        const updated = [...previous];
        updated[index] = value;
        return updated;
      });
    } else {
      setTeam2Players((previous) => {
        const updated = [...previous];
        updated[index] = value;
        return updated;
      });
    }

    setError("");
  };

  const continueToMatch = () => {
    const filledTeam1 = team1Players.filter(
      (player) => player.trim() !== ""
    );

    const filledTeam2 = team2Players.filter(
      (player) => player.trim() !== ""
    );

    if (filledTeam1.length === 0) {
      setError(`Please enter at least one player for ${match.team1}.`);
      return;
    }

    if (filledTeam2.length === 0) {
      setError(`Please enter at least one player for ${match.team2}.`);
      return;
    }

    setScreen("match-ready");
  };

  // =====================================================
  // HOME
  // =====================================================

  if (screen === "home") {
    return (
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="logo">🏏</div>

            <div>
              <h1>Cricket Scorebook</h1>
              <p>Score cricket anywhere</p>
            </div>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            Offline Ready
          </div>
        </header>

        <main className="dashboard">
          <section className="hero">
            <div>
              <span className="welcome">WELCOME TO</span>

              <h2>
                Your Cricket
                <br />
                Scorebook
              </h2>

              <p>
                Score matches, manage tournaments and keep cricket
                statistics — even without internet.
              </p>
            </div>

            <div className="hero-ball">🏏</div>
          </section>

          <section className="section">
            <h3>What do you want to do?</h3>

            <div className="main-actions">
              <button
                className="action-card quick"
                onClick={() => setScreen("create-match")}
              >
                <div className="action-icon">🏏</div>

                <div className="action-text">
                  <h4>Quick Match</h4>
                  <p>Score a single cricket match</p>
                </div>

                <span className="arrow">→</span>
              </button>

              <button className="action-card tournament">
                <div className="action-icon">🏆</div>

                <div className="action-text">
                  <h4>Tournaments & Leagues</h4>
                  <p>
                    Create teams, matches, points tables and
                    statistics
                  </p>
                </div>

                <span className="arrow">→</span>
              </button>
            </div>
          </section>

          <section className="section">
            <h3>Explore</h3>

            <div className="small-actions">
              <button className="small-card">
                <span>📊</span>

                <div>
                  <strong>Statistics</strong>
                  <small>Runs, wickets, sixes & more</small>
                </div>
              </button>

              <button className="small-card">
                <span>🏟️</span>

                <div>
                  <strong>My Matches</strong>
                  <small>View previous matches</small>
                </div>
              </button>

              <button className="small-card">
                <span>👥</span>

                <div>
                  <strong>Players</strong>
                  <small>Manage your players</small>
                </div>
              </button>
            </div>
          </section>

          <section className="offline-card">
            <div className="offline-icon">✓</div>

            <div>
              <strong>Works Offline</strong>

              <p>
                Your matches are saved safely on this device.
                Internet is not required for scoring.
              </p>
            </div>
          </section>
        </main>

        <footer>
          <span>🏏 Cricket Scorebook</span>
          <span>Offline First • Online When Available</span>
        </footer>
      </div>
    );
  }

  // =====================================================
  // CREATE MATCH
  // =====================================================

  if (screen === "create-match") {
    return (
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="logo">🏏</div>

            <div>
              <h1>Cricket Scorebook</h1>
              <p>Create a new match</p>
            </div>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            Offline Ready
          </div>
        </header>

        <main className="form-container">
          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            ← Back to Home
          </button>

          <div className="form-header">
            <span className="form-icon">🏏</span>

            <div>
              <h2>Create Quick Match</h2>
              <p>
                Set up your match before adding the players.
              </p>
            </div>
          </div>

          <div className="match-form">
            <div className="form-group">
              <label>Match Name</label>

              <input
                type="text"
                placeholder="Example: Sunday Cricket Match"
                value={match.matchName}
                onChange={(e) =>
                  updateMatch("matchName", e.target.value)
                }
              />

              <small>Optional — you can leave this empty.</small>
            </div>

            <div className="team-grid">
              <div className="form-group">
                <label>Team 1</label>

                <input
                  type="text"
                  placeholder="Enter first team"
                  value={match.team1}
                  onChange={(e) =>
                    updateMatch("team1", e.target.value)
                  }
                />
              </div>

              <div className="vs-box">VS</div>

              <div className="form-group">
                <label>Team 2</label>

                <input
                  type="text"
                  placeholder="Enter second team"
                  value={match.team2}
                  onChange={(e) =>
                    updateMatch("team2", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="settings-grid">
              <div className="form-group">
                <label>Number of Overs</label>

                <select
                  value={match.overs}
                  onChange={(e) =>
                    updateMatch(
                      "overs",
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={1}>1 Over</option>
                  <option value={2}>2 Overs</option>
                  <option value={5}>5 Overs</option>
                  <option value={6}>6 Overs</option>
                  <option value={8}>8 Overs</option>
                  <option value={9}>9 Overs</option>
                  <option value={10}>10 Overs</option>
                  <option value={12}>12 Overs</option>
                  <option value={15}>15 Overs</option>
                  <option value={20}>20 Overs</option>
                  <option value={30}>30 Overs</option>
                  <option value={40}>40 Overs</option>
                  <option value={50}>50 Overs</option>
                </select>
              </div>

              <div className="form-group">
                <label>Players per Team</label>

                <select
                  value={match.playersPerTeam}
                  onChange={(e) =>
                    updateMatch(
                      "playersPerTeam",
                      Number(e.target.value)
                    )
                  }
                >
                  {Array.from(
                    { length: 16 },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option value={number} key={number}>
                      {number}{" "}
                      {number === 1 ? "Player" : "Players"}
                    </option>
                  ))}
                </select>

                <small>
                  Teams can register up to 16 players.
                  Playing players are decided by the organizer.
                </small>
              </div>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <button
              className="start-button"
              onClick={startPlayerSetup}
            >
              CONTINUE TO PLAYERS →
            </button>
          </div>
        </main>

        <footer>
          <span>🏏 Cricket Scorebook</span>
          <span>Offline First • Online When Available</span>
        </footer>
      </div>
    );
  }

  // =====================================================
  // PLAYER MANAGEMENT
  // =====================================================

  if (screen === "players") {
    return (
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="logo">🏏</div>

            <div>
              <h1>Cricket Scorebook</h1>
              <p>Add team players</p>
            </div>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            Offline Ready
          </div>
        </header>

        <main className="players-container">
          <button
            className="back-button"
            onClick={() => setScreen("create-match")}
          >
            ← Back to Match Setup
          </button>

          <div className="players-title">
            <span className="form-icon">👥</span>

            <div>
              <h2>Team Players</h2>

              <p>
                Add the players registered for this match.
                Playing players can be decided later.
              </p>
            </div>
          </div>

          <div className="teams-player-grid">
            {/* TEAM 1 */}

            <section className="player-card">
              <div className="player-card-header">
                <div>
                  <span>TEAM 1</span>
                  <h3>{match.team1}</h3>
                </div>

                <strong>
                  {team1Players.filter((p) => p.trim()).length}/
                  {match.playersPerTeam}
                </strong>
              </div>

              <div className="player-list">
                {team1Players.map((player, index) => (
                  <div className="player-input-row" key={index}>
                    <span>{index + 1}</span>

                    <input
                      type="text"
                      placeholder={`Player ${index + 1}`}
                      value={player}
                      onChange={(e) =>
                        updatePlayer(
                          1,
                          index,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* TEAM 2 */}

            <section className="player-card">
              <div className="player-card-header">
                <div>
                  <span>TEAM 2</span>
                  <h3>{match.team2}</h3>
                </div>

                <strong>
                  {team2Players.filter((p) => p.trim()).length}/
                  {match.playersPerTeam}
                </strong>
              </div>

              <div className="player-list">
                {team2Players.map((player, index) => (
                  <div className="player-input-row" key={index}>
                    <span>{index + 1}</span>

                    <input
                      type="text"
                      placeholder={`Player ${index + 1}`}
                      value={player}
                      onChange={(e) =>
                        updatePlayer(
                          2,
                          index,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="player-note">
            <span>ℹ️</span>

            <div>
              <strong>Organizer controlled</strong>

              <p>
                There is no Playing XI restriction. The organizer
                can decide who plays, bats, bowls or fields during
                the match.
              </p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button
            className="start-button players-continue"
            onClick={continueToMatch}
          >
            SAVE PLAYERS & CONTINUE →
          </button>
        </main>

        <footer>
          <span>🏏 Cricket Scorebook</span>
          <span>Offline First • Online When Available</span>
        </footer>
      </div>
    );
  }

  // =====================================================
  // MATCH READY
  // =====================================================

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo">🏏</div>

          <div>
            <h1>Cricket Scorebook</h1>
            <p>Match setup complete</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Offline Ready
        </div>
      </header>

      <main className="ready-container">
        <div className="ready-icon">🏏</div>

        <span className="welcome">MATCH READY</span>

        <h2>
          {match.matchName.trim() || "Cricket Match"}
        </h2>

        <div className="teams-preview">
          <div>
            <span>TEAM 1</span>
            <strong>{match.team1}</strong>
          </div>

          <div className="preview-vs">VS</div>

          <div>
            <span>TEAM 2</span>
            <strong>{match.team2}</strong>
          </div>
        </div>

        <div className="match-info">
          <div>
            <span>OVERS</span>
            <strong>{match.overs}</strong>
          </div>

          <div>
            <span>TEAM 1 PLAYERS</span>
            <strong>
              {team1Players.filter((p) => p.trim()).length}
            </strong>
          </div>

          <div>
            <span>TEAM 2 PLAYERS</span>
            <strong>
              {team2Players.filter((p) => p.trim()).length}
            </strong>
          </div>
        </div>

        <div className="player-summary">
          <h3>Registered Players</h3>

          <div className="summary-teams">
            <div>
              <strong>{match.team1}</strong>

              {team1Players
                .filter((p) => p.trim())
                .map((player, index) => (
                  <span key={index}>
                    {index + 1}. {player}
                  </span>
                ))}
            </div>

            <div>
              <strong>{match.team2}</strong>

              {team2Players
                .filter((p) => p.trim())
                .map((player, index) => (
                  <span key={index}>
                    {index + 1}. {player}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="next-step-card">
          <strong>Next: Toss & Match Start</strong>

          <p>
            The next stage will let the organizer manage the toss,
            select the batting team, choose the opening batters and
            select the bowler.
          </p>
        </div>

        <button
          className="start-button"
          onClick={() => setScreen("players")}
        >
          ← Edit Players
        </button>
      </main>

      <footer>
        <span>🏏 Cricket Scorebook</span>
        <span>Offline First • Online When Available</span>
      </footer>
    </div>
  );
}

export default App;