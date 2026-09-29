import { useState } from "react";

type BatterStat = {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
};
type BattingCardEntry = {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissal: string;
};
type BowlingCardEntry = {
  name: string;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
};
type ScoreSnapshot = {
  score: number;
  wickets: number;
  legalBalls: number;
  striker: BatterStat;
  nonStriker: BatterStat;
  bowler: string;
  bowlerRuns: number;
  bowlerWickets: number;
  currentOver: string[];
};

type LiveScoreProps = {
  battingTeam: string;
  bowlingTeam: string;
  maxOvers: number;
  initialStriker: string;
  initialNonStriker: string;
  initialBowler: string;
  battingPlayers: string[];
  bowlingPlayers: string[];
};

function LiveScore({
  battingTeam,
  bowlingTeam,
  maxOvers,
  initialStriker,
  initialNonStriker,
  initialBowler,
  battingPlayers,
  bowlingPlayers,
}: LiveScoreProps) {
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [legalBalls, setLegalBalls] = useState(0);
const [innings, setInnings] = useState<1 | 2>(1);
const [isSuperOver, setIsSuperOver] = useState(false);
const [superOverActive, setSuperOverActive] = useState(false);
const [superOverInnings, setSuperOverInnings] = useState<1 | 2>(1);
const [superOverFirstScore, setSuperOverFirstScore] = useState<number | null>(null);
const [showMatchSummary, setShowMatchSummary] = useState(false);
const [matchWinner, setMatchWinner] = useState("");
const [matchResultText, setMatchResultText] = useState("");
const [superOverStriker, setSuperOverStriker] = useState("");
const [superOverNonStriker, setSuperOverNonStriker] = useState("");
const [superOverBowler, setSuperOverBowler] = useState("");
const [showSecondInningsSetup, setShowSecondInningsSetup] = useState(false);
const [secondStriker, setSecondStriker] = useState("");
const [secondNonStriker, setSecondNonStriker] = useState("");
const [secondBowler, setSecondBowler] = useState("");
const [firstInningsScore, setFirstInningsScore] = useState<number | null>(null);
const [currentBattingPlayers, setCurrentBattingPlayers] = useState(battingPlayers);
const [currentBowlingPlayers, setCurrentBowlingPlayers] = useState(bowlingPlayers);
const [currentBattingTeam, setCurrentBattingTeam] = useState(battingTeam);
const [currentBowlingTeam, setCurrentBowlingTeam] = useState(bowlingTeam);
  const [striker, setStriker] = useState<BatterStat>({
    name: initialStriker,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
  });

  const [nonStriker, setNonStriker] = useState<BatterStat>({
    name: initialNonStriker,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
  });

const [bowler, setBowler] = useState(initialBowler);
const [previousBowler, setPreviousBowler] = useState<string | null>(null);
const [selectNewBowler, setSelectNewBowler] = useState(false);
const [selectNewBatter, setSelectNewBatter] = useState(false);
const [showWicketOptions, setShowWicketOptions] = useState(false);
const [newBatterPosition, setNewBatterPosition] =
  useState<"striker" | "nonStriker">("striker");
const [dismissedBatters, setDismissedBatters] = useState<string[]>([]);
const [battingCard, setBattingCard] =
  useState<BattingCardEntry[]>([]);
  const [showBattingCard, setShowBattingCard] = useState(false);
const [showBowlingCard, setShowBowlingCard] = useState(false);

const [battingOrder, setBattingOrder] = useState<string[]>([
  initialStriker,
  initialNonStriker,
]);
  const [bowlingCard, setBowlingCard] =
  useState<BowlingCardEntry[]>([]);

  const [firstInningsBattingCard, setFirstInningsBattingCard] =
  useState<BattingCardEntry[]>([]);

const [firstInningsBowlingCard, setFirstInningsBowlingCard] =
  useState<BowlingCardEntry[]>([]);
const [bowlerRuns, setBowlerRuns] = useState(0);
const [bowlerWickets, setBowlerWickets] = useState(0);
const [currentBowlerOverRuns, setCurrentBowlerOverRuns] = useState(0);

  const [currentOver, setCurrentOver] = useState<string[]>([]);

const [selectedExtra, setSelectedExtra] = useState<
  "WD" | "NB" | "B" | "LB" | null
>(null);

const [history, setHistory] = useState<ScoreSnapshot[]>([]);

  const oversDisplay = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
  const target = firstInningsScore !== null ? firstInningsScore + 1 : null;
  const superOverTarget =
  superOverFirstScore !== null ? superOverFirstScore + 1 : null;

  const getCompleteBattingCard = (
  savedCard: BattingCardEntry[],
  currentStriker: BatterStat,
  currentNonStriker: BatterStat
) => {
  const players = [...savedCard];

  const addOrUpdate = (player: BatterStat) => {
    if (!player.name) return;

    const existingIndex = players.findIndex(
      (item) => item.name === player.name
    );

    if (existingIndex >= 0) {
      players[existingIndex] = {
        ...players[existingIndex],
        ...player,
      };
    } else {
      players.push({
        ...player,
        isOut: false,
        dismissal: "",
      });
    }
  };

  addOrUpdate(currentStriker);
  addOrUpdate(currentNonStriker);

  return players;
};
  
  const saveHistory = () => {
    setHistory((previous) => [
      ...previous,
      {
        score,
        wickets,
        legalBalls,
        striker: { ...striker },
        nonStriker: { ...nonStriker },
        bowler,
        bowlerRuns,
        bowlerWickets,
        currentOver: [...currentOver],
      },
    ]);
  };

  const swapBatters = (
    first: BatterStat,
    second: BatterStat
  ): [BatterStat, BatterStat] => {
    return [second, first];
  };

  const addRuns = (runs: number) => {
    if (legalBalls >= maxOvers * 6) return;

    saveHistory();

    let updatedStriker: BatterStat = {
      ...striker,
      runs: striker.runs + runs,
      balls: striker.balls + 1,
      fours: striker.fours + (runs === 4 ? 1 : 0),
      sixes: striker.sixes + (runs === 6 ? 1 : 0),
    };

    let updatedNonStriker = { ...nonStriker };

    let newLegalBalls = legalBalls + 1;

    if (runs % 2 === 1) {
      [updatedStriker, updatedNonStriker] = swapBatters(
        updatedStriker,
        updatedNonStriker
      );
    }

    if (newLegalBalls % 6 === 0) {
      [updatedStriker, updatedNonStriker] = swapBatters(
        updatedStriker,
        updatedNonStriker
      );
    }

    setScore(score + runs);
    setBowlerRuns(bowlerRuns + runs);
    setCurrentBowlerOverRuns(currentBowlerOverRuns + runs);
    setLegalBalls(newLegalBalls);
    setStriker(updatedStriker);
    setNonStriker(updatedNonStriker);

    if (newLegalBalls % 6 === 0) {
  const completedOverRuns = currentBowlerOverRuns + runs;

  setBowlingCard((previous) => {
    const existingBowler = previous.find(
      (player) => player.name === bowler
    );

    if (existingBowler) {
      return previous.map((player) =>
        player.name === bowler
          ? {
              ...player,
              balls: player.balls + 6,
              runs: player.runs + completedOverRuns,
              wickets: player.wickets + bowlerWickets,
              maidens:
                player.maidens + (completedOverRuns === 0 ? 1 : 0),
            }
          : player
      );
    }

    return [
      ...previous,
      {
        name: bowler,
        balls: 6,
        runs: completedOverRuns,
        wickets: bowlerWickets,
        maidens: completedOverRuns === 0 ? 1 : 0,
      },
    ];
  });

  setCurrentBowlerOverRuns(0);
  setCurrentOver([]);
  setPreviousBowler(bowler);
  setSelectNewBowler(true);
} else {
  setCurrentOver([...currentOver, String(runs)]);
}
  };

  // WIDE
const addWide = (extraRuns: number) => {
  saveHistory();

  const totalRuns = 1 + extraRuns;

  let updatedStriker = { ...striker };
  let updatedNonStriker = { ...nonStriker };

  if (extraRuns % 2 === 1) {
    [updatedStriker, updatedNonStriker] = swapBatters(
      updatedStriker,
      updatedNonStriker
    );
  }

  setScore(score + totalRuns);
  setBowlerRuns(bowlerRuns + totalRuns);
setCurrentBowlerOverRuns(currentBowlerOverRuns + totalRuns);
  setStriker(updatedStriker);
  setNonStriker(updatedNonStriker);

  setCurrentOver([
    ...currentOver,
    extraRuns === 0 ? "WD" : `WD+${extraRuns}`,
  ]);
};


// NO BALL
const addNoBall = (batRuns: number) => {
  saveHistory();

  const totalRuns = 1 + batRuns;

  let updatedStriker: BatterStat = {
    ...striker,
    runs: striker.runs + batRuns,
    balls: striker.balls,
    fours: striker.fours + (batRuns === 4 ? 1 : 0),
    sixes: striker.sixes + (batRuns === 6 ? 1 : 0),
  };

  let updatedNonStriker = { ...nonStriker };

  if (batRuns % 2 === 1) {
    [updatedStriker, updatedNonStriker] = swapBatters(
      updatedStriker,
      updatedNonStriker
    );
  }

  setScore(score + totalRuns);
  setBowlerRuns(bowlerRuns + totalRuns);
setCurrentBowlerOverRuns(currentBowlerOverRuns + totalRuns);
  setStriker(updatedStriker);
  setNonStriker(updatedNonStriker);

  setCurrentOver([
    ...currentOver,
    batRuns === 0 ? "NB" : `NB+${batRuns}`,
  ]);
};


// BYE / LEG BYE
const addBye = (
  type: "B" | "LB",
  extraRuns: number
) => {
  if (legalBalls >= maxOvers * 6) return;

  saveHistory();

  const newLegalBalls = legalBalls + 1;

  let updatedStriker: BatterStat = {
    ...striker,
    balls: striker.balls + 1,
  };

  let updatedNonStriker = { ...nonStriker };

  if (extraRuns % 2 === 1) {
    [updatedStriker, updatedNonStriker] = swapBatters(
      updatedStriker,
      updatedNonStriker
    );
  }

  if (newLegalBalls % 6 === 0) {
    [updatedStriker, updatedNonStriker] = swapBatters(
      updatedStriker,
      updatedNonStriker
    );
  }

  setScore(score + extraRuns);
  setLegalBalls(newLegalBalls);

  setStriker(updatedStriker);
  setNonStriker(updatedNonStriker);

  if (newLegalBalls % 6 === 0) {
    setCurrentOver([]);
  } else {
    setCurrentOver([
      ...currentOver,
      `${type}+${extraRuns}`,
    ]);
  }
};

  const addWicket = (wicketType: string) => {
    const isBowlerWicket = wicketType !== "Run Out";
    if (legalBalls >= maxOvers * 6) return;

    saveHistory();
    setShowWicketOptions(false);
    setDismissedBatters((previous) => [
  ...previous,
  striker.name,
]);
setBattingCard((previous) => [
  ...previous,
  {
    name: striker.name,
    runs: striker.runs,
    balls: striker.balls,
    fours: striker.fours,
    sixes: striker.sixes,
    isOut: true,
    dismissal: wicketType,
  },
]);

    const newLegalBalls = legalBalls + 1;

    let updatedStriker = {
      ...striker,
      balls: striker.balls + 1,
    };

    let updatedNonStriker = { ...nonStriker };

    if (newLegalBalls % 6 === 0) {
      [updatedStriker, updatedNonStriker] = swapBatters(
        updatedStriker,
        updatedNonStriker
      );
    }

 setWickets(wickets + 1);
if (isBowlerWicket) {
  setBowlerWickets(bowlerWickets + 1);
}
setLegalBalls(newLegalBalls);

setStriker(updatedStriker);
setNonStriker(updatedNonStriker);
if (newLegalBalls % 6 === 0) {
  setNewBatterPosition("nonStriker");
} else {
  setNewBatterPosition("striker");
}
setSelectNewBatter(true);

   if (newLegalBalls % 6 === 0) {
  const completedOverRuns = currentBowlerOverRuns;

  setBowlingCard((previous) => {
    const existingBowler = previous.find(
      (player) => player.name === bowler
    );

    if (existingBowler) {
      return previous.map((player) =>
        player.name === bowler
          ? {
              ...player,
              balls: player.balls + 6,
              runs: player.runs + completedOverRuns,
              wickets: player.wickets + bowlerWickets + 1,
              maidens:
                player.maidens + (completedOverRuns === 0 ? 1 : 0),
            }
          : player
      );
    }

    return [
      ...previous,
      {
        name: bowler,
        balls: 6,
        runs: completedOverRuns,
        wickets: bowlerWickets + 1,
        maidens: completedOverRuns === 0 ? 1 : 0,
      },
    ];
  });

  setCurrentBowlerOverRuns(0);
  setCurrentOver([]);
  setPreviousBowler(bowler);
  setSelectNewBowler(true);
} else {
  setCurrentOver([...currentOver, "W"]);
}
  };

  const undoLastBall = () => {
    if (history.length === 0) return;

    const previous = history[history.length - 1];

    setScore(previous.score);
    setWickets(previous.wickets);
    setLegalBalls(previous.legalBalls);
    setStriker(previous.striker);
    setNonStriker(previous.nonStriker);
    setBowler(previous.bowler);
    setBowlerRuns(previous.bowlerRuns);
    setBowlerWickets(previous.bowlerWickets);
    setCurrentOver(previous.currentOver);
    setSelectNewBowler(false);
    if (wickets > previous.wickets) {
  setSelectNewBatter(false);
  setShowWicketOptions(false);

  setDismissedBatters((current) =>
    current.filter((name) => name !== previous.striker.name)
  );

  setBattingCard((current) => current.slice(0, -1));
}

    setHistory((oldHistory) =>
      oldHistory.slice(0, oldHistory.length - 1)
    );
  };
  if (showMatchSummary) {
  return (
    <div className="match-summary-page">
      <div className="match-summary-card">
        <div className="match-summary-trophy">🏆</div>

        <h1>Match Summary</h1>

        <h2>{matchWinner || "Match Completed"}</h2>

        {matchResultText && (
          <p className="match-summary-result">
            {matchResultText}
          </p>
        )}

        <div className="match-summary-scores">
          <div>
            <span>{battingTeam}</span>
            <strong>{firstInningsScore ?? "—"}</strong>
          </div>

          <div>
            <span>{currentBattingTeam}</span>
            <strong>{score}</strong>
          </div>
        </div>
        <div className="match-summary-full-card">
  <div className="innings-summary-title">
  <span>1ST INNINGS</span>
  <strong>{battingTeam}</strong>
</div>
  <h3>{battingTeam} — Batting</h3>

  <div className="match-summary-table">
    <div className="match-summary-table-header">
      <span>BATTER</span>
      <span>R</span>
      <span>B</span>
      <span>4s</span>
      <span>6s</span>
      <span>SR</span>
    </div>

    {firstInningsBattingCard.map((player, index) => (
      <div className="match-summary-table-row" key={index}>
        <span>{player.name}</span>
        <span>{player.runs}</span>
        <span>{player.balls}</span>
        <span>{player.fours}</span>
        <span>{player.sixes}</span>
        <span>
          {player.balls > 0
            ? ((player.runs / player.balls) * 100).toFixed(2)
            : "0.00"}
        </span>
      </div>
    ))}
  </div>
</div>
<div className="match-summary-full-card">
  <h3>{bowlingTeam} — Bowling</h3>

  <div className="match-summary-table bowling-summary-table">
    <div className="match-summary-table-header bowling-summary-grid">
      <span>BOWLER</span>
      <span>O</span>
      <span>R</span>
      <span>W</span>
      <span>ECON</span>
    </div>

    {firstInningsBowlingCard.map((player, index) => (
      <div
        className="match-summary-table-row bowling-summary-grid"
        key={index}
      >
        <span>{player.name}</span>
        <span>{Math.floor(player.balls / 6)}.{player.balls % 6}</span>
        <span>{player.runs}</span>
        <span>{player.wickets}</span>
        <span>
          {player.balls > 0
            ? ((player.runs * 6) / player.balls).toFixed(2)
            : "0.00"}
        </span>
      </div>
    ))}
  </div>
</div>
<div className="match-summary-full-card">
  <div className="innings-summary-title">
  <span>2ND INNINGS</span>
  <strong>{currentBattingTeam}</strong>
</div>
  <h3>{currentBattingTeam} — Batting</h3>

  <div className="match-summary-table">
    <div className="match-summary-table-header">
      <span>BATTER</span>
      <span>R</span>
      <span>B</span>
      <span>4s</span>
      <span>6s</span>
      <span>SR</span>
    </div>

    {getCompleteBattingCard(
  battingCard,
  striker,
  nonStriker
).map((player, index) => (
      <div className="match-summary-table-row" key={index}>
        <span>{player.name}</span>
        <span>{player.runs}</span>
        <span>{player.balls}</span>
        <span>{player.fours}</span>
        <span>{player.sixes}</span>
        <span>
          {player.balls > 0
            ? ((player.runs / player.balls) * 100).toFixed(2)
            : "0.00"}
        </span>
      </div>
    ))}
  </div>
</div>
<div className="match-summary-full-card">
  <h3>{currentBowlingTeam} — Bowling</h3>

  <div className="match-summary-table bowling-summary-table">
    <div className="match-summary-table-header bowling-summary-grid">
      <span>BOWLER</span>
      <span>O</span>
      <span>R</span>
      <span>W</span>
      <span>ECON</span>
    </div>

    {bowlingCard.map((player, index) => (
      <div
        className="match-summary-table-row bowling-summary-grid"
        key={index}
      >
        <span>{player.name}</span>
        <span>{Math.floor(player.balls / 6)}.{player.balls % 6}</span>
        <span>{player.runs}</span>
        <span>{player.wickets}</span>
        <span>
          {player.balls > 0
            ? ((player.runs * 6) / player.balls).toFixed(2)
            : "0.00"}
        </span>
      </div>
    ))}
  </div>
</div>
        <button
  className="match-summary-button"
  onClick={() => setShowMatchSummary(false)}
>
  ← BACK TO SCORECARD
</button>
<button
  className="match-summary-button"
  onClick={() => window.location.reload()}
>
  🔄 NEW MATCH
</button>
      </div>
    </div>
  );
}
  if (isSuperOver) {
  return (
    <div className="live-score-page">
      <div className="second-innings-setup-card">
        <h2>Super Over Setup</h2>

        <div className="second-innings-field">
          <label>Striker</label>

          <select
            value={superOverStriker}
            onChange={(e) => setSuperOverStriker(e.target.value)}
          >
            <option value="">Select Striker</option>

            {currentBattingPlayers.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>

          <small>Select the striker for the Super Over.</small>
        </div>
        <div className="second-innings-field">
  <label>Non-Striker</label>

  <select
    value={superOverNonStriker}
    onChange={(e) => setSuperOverNonStriker(e.target.value)}
  >
    <option value="">Select Non-Striker</option>

    {currentBattingPlayers
      .filter((player) => player !== superOverStriker)
      .map((player) => (
        <option key={player} value={player}>
          {player}
        </option>
      ))}
  </select>

  <small>Select the non-striker for the Super Over.</small>
</div>
        <div className="second-innings-field">
  <label>Bowler</label>

  <select
    value={superOverBowler}
    onChange={(e) => setSuperOverBowler(e.target.value)}
  >
    <option value="">Select Bowler</option>

    {currentBowlingPlayers.map((player) => (
      <option key={player} value={player}>
        {player}
      </option>
    ))}
  </select>

  <small>Select the bowler for the Super Over.</small>
</div>
<button
  className="start-second-innings-button"
  disabled={
    !superOverStriker ||
    !superOverNonStriker ||
    !superOverBowler
  }
  onClick={() => {
    setStriker({
      name: superOverStriker,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    });

    setNonStriker({
      name: superOverNonStriker,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    });

    setBowler(superOverBowler);

    setScore(0);
    setWickets(0);
    setLegalBalls(0);
    setCurrentOver([]);

    setBowlerRuns(0);
    setBowlerWickets(0);
    setCurrentBowlerOverRuns(0);

    setDismissedBatters([]);
    setBattingCard([]);
    setBowlingCard([]);

    setBattingOrder([
      superOverStriker,
      superOverNonStriker,
    ]);

    setPreviousBowler(null);
    setSelectNewBatter(false);
    setSelectNewBowler(false);
    setShowWicketOptions(false);
setSuperOverActive(true);
    setIsSuperOver(false);
  }}
>
  START SUPER OVER
</button>
      </div>
    </div>
  );
}
if (showSecondInningsSetup) {
  return (
    <div className="live-score-page">
      <div className="second-innings-setup-card">
        <h2>Second Innings Setup</h2>

        <div className="second-innings-field">
  <label>Striker</label>

  <select
    value={secondStriker}
    onChange={(e) => setSecondStriker(e.target.value)}
  >
    <option value="">Select Striker</option>

    {currentBattingPlayers.map((player) => (
      <option key={player} value={player}>
        {player}
      </option>
    ))}
  </select>

  <small>This batter will face the first ball.</small>
</div>
        <div className="second-innings-field">
  <label>Non-Striker</label>

  <select
    value={secondNonStriker}
    onChange={(e) => setSecondNonStriker(e.target.value)}
  >
    <option value="">Select Non-Striker</option>

    {currentBattingPlayers
      .filter((player) => player !== secondStriker)
      .map((player) => (
        <option key={player} value={player}>
          {player}
        </option>
      ))}
  </select>

  <small>This batter will start at the other end.</small>
</div>
<div className="second-innings-field">
  <label>Bowler</label>

  <select
    value={secondBowler}
    onChange={(e) => setSecondBowler(e.target.value)}
  >
    <option value="">Select Bowler</option>

    {currentBowlingPlayers.map((player) => (
      <option key={player} value={player}>
        {player}
      </option>
    ))}
  </select>

  <small>This player will bowl the first over.</small>
</div>
<button
  className="start-second-innings-button"
  disabled={!secondStriker || !secondNonStriker || !secondBowler}
  onClick={() => {
    setStriker({
      name: secondStriker,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    });

    setNonStriker({
      name: secondNonStriker,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    });

    setBowler(secondBowler);

    setBowlerRuns(0);
    setBowlerWickets(0);
    setCurrentBowlerOverRuns(0);

    setBattingOrder([secondStriker, secondNonStriker]);
    setPreviousBowler(null);

    setShowSecondInningsSetup(false);
  }}
>
  START CHASE
</button>
      </div>
    </div>
  );
}
  return (
    <div className="live-score-page">
      <header className="live-header compact-live-header">
  <div className="match-title">
    <strong>{currentBattingTeam}</strong>
    <span>vs {currentBowlingTeam}</span>
  </div>

  <div className="live-offline">
    <span></span>
    Offline Ready
  </div>
</header>

      <section className="main-score-card scoreboard-modern">

  <div className="scoreboard-title">
    <strong>{currentBattingTeam}</strong>
    <span>
  {superOverActive
    ? `Super Over ${superOverInnings === 1 ? "1st Innings" : "2nd Innings"} • 1 Over`
    : `${innings === 1 ? "1st Innings" : "2nd Innings"} • ${maxOvers} Overs`}
</span>
  </div>

  <div className="scoreboard-main">
    <div className="big-score">
  <span className="score-runs">{score}</span>
  <span className="score-wickets">/{wickets}</span>
</div>

    <div className="big-overs">
      <strong>{oversDisplay}</strong>
      <span>Overs</span>
    </div>
  </div>
{superOverActive &&
superOverInnings === 2 &&
superOverTarget !== null &&
score < superOverTarget ? (
  <div className="chase-banner">
    <strong>Need {superOverTarget - score} runs</strong>
    <span>from {6 - legalBalls} balls</span>
  </div>
) : innings === 2 && target !== null && score < target ? (
  <div className="chase-banner">
    <strong>Need {target - score} runs</strong>
    <span>from {maxOvers * 6 - legalBalls} balls</span>
  </div>
) : null}
  <div className="scoreboard-stats">

    <div>
      <span>CRR</span>
      <strong>
        {legalBalls === 0
          ? "0.00"
          : (score / (legalBalls / 6)).toFixed(2)}
      </strong>
    </div>

    <div>
  <span>RRR</span>

  <strong>
    {superOverActive &&
    superOverInnings === 2 &&
    superOverTarget !== null
      ? (() => {
          const runsNeeded = Math.max(superOverTarget - score, 0);
          const ballsRemaining = 6 - legalBalls;

          if (runsNeeded === 0) return "0.00";
          if (ballsRemaining <= 0) return "—";

          return ((runsNeeded * 6) / ballsRemaining).toFixed(2);
        })()
      : innings === 2 && target !== null
      ? (() => {
          const runsNeeded = Math.max(target - score, 0);
          const ballsRemaining = maxOvers * 6 - legalBalls;

          if (runsNeeded === 0) return "0.00";
          if (ballsRemaining <= 0) return "—";

          return ((runsNeeded * 6) / ballsRemaining).toFixed(2);
        })()
      : "—"}
  </strong>
</div>

   <div>
  <span>TARGET</span>

  <strong>
    {superOverActive &&
    superOverInnings === 2 &&
    superOverTarget !== null
      ? superOverTarget
      : innings === 2 && target !== null
      ? target
      : "—"}
  </strong>
</div>

  </div>

</section>

      <section className="score-details-card">
  <div className="score-table">
    <div className="score-table-header batsman-grid">
      <span>BATSMAN</span>
      <span>R</span>
      <span>B</span>
      <span>4s</span>
      <span>6s</span>
      <span>SR</span>
    </div>

    <div className="score-table-row batsman-grid active-batsman-row">
      <strong>{striker.name} *</strong>
      <span>{striker.runs}</span>
      <span>{striker.balls}</span>
      <span>{striker.fours}</span>
      <span>{striker.sixes}</span>
      <span>
        {striker.balls === 0
          ? "0.00"
          : ((striker.runs / striker.balls) * 100).toFixed(2)}
      </span>
    </div>

    <div className="score-table-row batsman-grid">
      <strong>{nonStriker.name}</strong>
      <span>{nonStriker.runs}</span>
      <span>{nonStriker.balls}</span>
      <span>{nonStriker.fours}</span>
      <span>{nonStriker.sixes}</span>
      <span>
        {nonStriker.balls === 0
          ? "0.00"
          : ((nonStriker.runs / nonStriker.balls) * 100).toFixed(2)}
      </span>
    </div>
  </div>
</section>
{showBattingCard && (
  <section className="full-batting-card">
  <div className="full-card-title">
    <strong>BATTING CARD</strong>
  </div>

  <div className="score-table-header batting-card-grid">
    <span>BATSMAN</span>
    <span>R</span>
    <span>B</span>
    <span>4s</span>
    <span>6s</span>
    <span>SR</span>
    <span>STATUS</span>
  </div>
{battingOrder.map((playerName, index) => {
  let player: BattingCardEntry;

  if (playerName === striker.name) {
    player = {
      ...striker,
      isOut: false,
      dismissal: "",
    };
  } else if (playerName === nonStriker.name) {
    player = {
      ...nonStriker,
      isOut: false,
      dismissal: "",
    };
  } else {
    const dismissedPlayer = battingCard.find(
      (item) => item.name === playerName
    );

    if (!dismissedPlayer) return null;

    player = dismissedPlayer;
  }

  return (
    <div
      className={`score-table-row batting-card-grid ${
        !player.isOut ? "current-card-player" : ""
      }`}
      key={`${player.name}-${index}`}
    >
      <strong>
        {player.name}
        {player.name === striker.name ? " *" : ""}
      </strong>

      <span>{player.runs}</span>
      <span>{player.balls}</span>
      <span>{player.fours}</span>
      <span>{player.sixes}</span>

      <span>
        {player.balls === 0
          ? "0.00"
          : ((player.runs / player.balls) * 100).toFixed(2)}
      </span>

      <span>{player.isOut ? player.dismissal : "NOT OUT"}
</span>
    </div>
  );
})}
</section>
)}
{selectNewBatter && (
  <section className="new-batter-card">
    <h3>Wicket! Select New Batter</h3>
    <p>Choose the next batter to continue the innings.</p>

    <select
      defaultValue=""
      onChange={(e) => {
        const newBatter = e.target.value;

        if (!newBatter) return;
        setBattingOrder((previous) =>
  previous.includes(newBatter)
    ? previous
    : [...previous, newBatter]
);

        const batterData = {
  name: newBatter,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
};

if (newBatterPosition === "striker") {
  setStriker(batterData);
} else {
  setNonStriker(batterData);
}

        setSelectNewBatter(false);
      }}
    >
      <option value="">Select New Batter</option>

      {battingPlayers
        .filter(
  (player) =>
    player !== striker.name &&
    player !== nonStriker.name &&
    !dismissedBatters.includes(player)
) 
        .map((player) => (
          <option key={player} value={player}>
            {player}
          </option>
        ))}
    </select>
  </section>
)}
      <section className="bowler-table-card">
  <div className="score-table-header bowler-grid">
    <span>BOWLER</span>
    <span>R</span>
    <span>W</span>
  </div>

  <div className="score-table-row bowler-grid">
    <strong>{bowler}</strong>
    <span>{bowlerRuns}</span>
    <span>{bowlerWickets}</span>
  </div>
</section>
  {showBowlingCard && (
  <section className="full-bowling-card">
  <div className="full-card-title">
    <strong>BOWLING CARD</strong>
  </div>

  <div className="score-table-header bowling-card-grid">
    <span>BOWLER</span>
    <span>O</span>
    <span>M</span>
    <span>R</span>
    <span>W</span>
    <span>ER</span>
  </div>

  {bowlingCard.map((player, index) => {
    const overs =
      `${Math.floor(player.balls / 6)}.${player.balls % 6}`;

    const economy =
      player.balls === 0
        ? "0.00"
        : (player.runs / (player.balls / 6)).toFixed(2);

    return (
      <div
        className="score-table-row bowling-card-grid"
        key={`${player.name}-${index}`}
      >
        <strong>{player.name}</strong>
        <span>{overs}</span>
        <span>{player.maidens}</span>
        <span>{player.runs}</span>
        <span>{player.wickets}</span>
        <span>{economy}</span>
      </div>
    );
  })}
</section>
)}
      {selectNewBowler && (
  <section className="new-bowler-card">
    <h3>Over Complete</h3>
    <p>Select the bowler for the next over.</p>

    <select
      defaultValue=""
      onChange={(e) => {
        const newBowler = e.target.value;

        if (!newBowler) return;

        setBowler(newBowler);
        setBowlerRuns(0);
        setBowlerWickets(0);
        setSelectNewBowler(false);
      }}
    >
      <option value="">Select new bowler</option>

      {currentBowlingPlayers
  .filter((player) => player !== previousBowler)
  .map((player) => (
    <option key={player} value={player}>
      {player}
    </option>
  ))}
    </select>
  </section>
)}

      <section className="current-over-card">
        <div className="over-title">
          <strong>Current Over</strong>
          <span>{oversDisplay}</span>
        </div>

        <div className="ball-list">
          {currentOver.length === 0 ? (
            <small>No balls recorded yet</small>
          ) : (
            currentOver.map((ball, index) => (
              <span
                className={`ball-chip ${
                  ball === "W" ? "wicket-ball" : ""
                }`}
                key={index}
              >
                {ball}
              </span>
            ))
          )}
        </div>
      </section>
<div className="scorecard-action-buttons">
  <button
    onClick={() => {
  setShowBattingCard(!showBattingCard);
  setShowBowlingCard(false);
}}
  >
    Batting Card
  </button>
  <button
  onClick={() => {
  setShowBowlingCard(!showBowlingCard);
  setShowBattingCard(false);
}}
>
  Bowling Card
</button>
</div>
      <section
  className={`scoring-panel ${
  selectNewBowler || selectNewBatter
    ? "scoring-disabled"
    : ""
}`}
>
        <h3>Runs</h3>

        <div className="run-buttons">
          {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
           <button
  key={runs}
  onClick={() => addRuns(runs)}
 disabled={selectNewBowler || selectNewBatter}
>
              {runs}
            </button>
          ))}
        </div>

        <h3>Extras</h3>

        <div className="extra-buttons">
  <button
  onClick={() => setSelectedExtra("WD")}
  disabled={selectNewBowler || selectNewBatter}
>
  WD
</button>

 <button
  onClick={() => setSelectedExtra("NB")}
  disabled={selectNewBowler || selectNewBatter}
>
  NB
</button>

  <button
  onClick={() => setSelectedExtra("B")}
  disabled={selectNewBowler || selectNewBatter}
>
  BYE
</button>

  <button
  onClick={() => setSelectedExtra("LB")}
  disabled={selectNewBowler || selectNewBatter}
>
  LB
</button>
</div>
{selectedExtra && (
  <div className="extra-run-selector">
    <div className="extra-run-header">
      <strong>
        {selectedExtra === "WD"
          ? "Wide"
          : selectedExtra === "NB"
          ? "No Ball"
          : selectedExtra === "B"
          ? "Bye"
          : "Leg Bye"}
      </strong>

      <button onClick={() => setSelectedExtra(null)}>
        ✕
      </button>
    </div>

    <p>Select additional runs</p>

    <div className="extra-run-options">
      {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
        <button
          key={runs}
          onClick={() => {
            if (selectedExtra === "WD") {
              addWide(runs);
            }

            if (selectedExtra === "NB") {
              addNoBall(runs);
            }

            if (selectedExtra === "B") {
              addBye("B", runs);
            }

            if (selectedExtra === "LB") {
              addBye("LB", runs);
            }

            setSelectedExtra(null);
          }}
        >
          +{runs}
        </button>
      ))}
    </div>
  </div>
)}

        <div className="special-buttons">
          <button
  className="wicket-button"
  onClick={() => setShowWicketOptions(true)}
  disabled={selectNewBowler || selectNewBatter}
>
  WICKET
</button>

          <button
            className="undo-button"
            onClick={undoLastBall}
            disabled={history.length === 0}
          >
            ↶ UNDO
          </button>
        </div>
        {showWicketOptions && (
  <div className="wicket-options">
    <button onClick={() => addWicket("Bowled")}>Bowled</button>
    <button onClick={() => addWicket("Caught")}>Caught</button>
    <button onClick={() => addWicket("LBW")}>LBW</button>
    <button onClick={() => addWicket("Stumped")}>Stumped</button>
    <button onClick={() => addWicket("Run Out")}>Run Out</button>
    <button onClick={() => addWicket("Hit Wicket")}>Hit Wicket</button>
  </div>
)}
      </section>

      <section className="innings-status">
       {legalBalls >= (superOverActive ? 6 : maxOvers * 6) ? (
          <strong>🏁 Innings Overs Completed</strong>
        ) : (
          <span>
            {(superOverActive ? 6 : maxOvers * 6) - legalBalls} legal balls remaining
          </span>
        )}
        {wickets >= battingPlayers.length - 1 && history.length > 0 && (
  <button
    className="undo-button"
    onClick={undoLastBall}
  >
    ↶ UNDO LAST WICKET
  </button>
)}
{innings === 1 && !superOverActive &&
  (legalBalls >= (superOverActive ? 6 : maxOvers * 6) ||
    wickets >= battingPlayers.length - 1) && (
    <div className="innings-complete-overlay">
  <button
    className="first-innings-undo-button"
    onClick={undoLastBall}
    disabled={history.length === 0}
  >
    ↶ UNDO LAST BALL
  </button> 
    <button
      className="start-second-innings-button"
      onClick={() => {
  setFirstInningsScore(score);
  setInnings(2);
  setShowSecondInningsSetup(true);
setCurrentBattingTeam(bowlingTeam);
setCurrentBowlingTeam(battingTeam);
setCurrentBattingPlayers(bowlingPlayers);
setCurrentBowlingPlayers(battingPlayers);
  setScore(0);
  setWickets(0);
  setLegalBalls(0);
  setCurrentOver([]);

  setDismissedBatters([]);
  setFirstInningsBattingCard(
  getCompleteBattingCard(battingCard, striker, nonStriker)
);
setFirstInningsBowlingCard(bowlingCard);
  setBattingCard([]);
  setBowlingCard([]);

  setSelectNewBatter(false);
  setSelectNewBowler(false);
  setShowWicketOptions(false);
}}
    >
      START SECOND INNINGS
    </button>
    </div>
    )}
    {superOverActive &&
  superOverInnings === 2 &&
  superOverTarget !== null &&
  (score >= superOverTarget || legalBalls >= 6) && (
    <div className="match-result-overlay">
      <div className="match-result-card">
        {score >= superOverTarget ? (
          <strong>🏆 {currentBattingTeam} won the Super Over</strong>
        ) : score === superOverFirstScore ? (
          <strong>🤝 Super Over Tied</strong>
        ) : (
          <strong>🏆 {currentBowlingTeam} won the Super Over</strong>
        )}
{score !== superOverFirstScore && (
  <button
    className="match-summary-button"
    onClick={() => {
      const winner =
        score >= superOverTarget
          ? currentBattingTeam
          : currentBowlingTeam;

      setMatchWinner(winner);
      setMatchResultText(`${winner} won the match in the Super Over`);
      setShowMatchSummary(true);
    }}
  >
    VIEW MATCH SUMMARY
  </button>
)}
        <button
          className="match-result-undo"
          onClick={undoLastBall}
          disabled={history.length === 0}
        >
          ↶ UNDO LAST BALL
        </button>
      </div>
    </div>
  )}
    {superOverActive &&
  superOverInnings === 1 &&
  legalBalls >= 6 && (
    <div className="match-result-overlay">
      <div className="match-result-card">
        <strong>🏏 Super Over Completed</strong>

        <button
          className="match-result-undo"
          onClick={undoLastBall}
          disabled={history.length === 0}
        >
          ↶ UNDO LAST BALL
        </button>
        <button
  className="start-second-innings-button"
  onClick={() => {
    setSuperOverFirstScore(score);
setSuperOverInnings(2);
setScore(0);
setWickets(0);
setLegalBalls(0);
setCurrentOver([]);
setBowlerRuns(0);
setBowlerWickets(0);
setCurrentBowlerOverRuns(0);

setDismissedBatters([]);
setBattingCard([]);
setBowlingCard([]);
setSuperOverStriker("");
setSuperOverNonStriker("");
setSuperOverBowler("");
    setCurrentBattingTeam(currentBowlingTeam);
    setCurrentBowlingTeam(currentBattingTeam);

    setCurrentBattingPlayers(currentBowlingPlayers);
    setCurrentBowlingPlayers(currentBattingPlayers);

    setIsSuperOver(true);
  }}
>
  CONTINUE SUPER OVER
</button>
      </div>
    </div>
  )}
  {innings === 2 &&
  target !== null &&
  (score >= target ||
    legalBalls >= maxOvers * 6 ||
    wickets >= currentBattingPlayers.length - 1) && (
  <div className="match-result-overlay">
  <div className="match-result-card">
    {score >= target ? (
      <strong>🏆 {currentBattingTeam} won the match</strong>
    ) : legalBalls >= maxOvers * 6 ||
      wickets >= currentBattingPlayers.length - 1 ? (
      score === target - 1 ? (
        <div className="tie-result">
  <strong>🤝 Match Tied</strong>

  <button
    className="super-over-button"
    onClick={() => setIsSuperOver(true)}
  >
    START SUPER OVER
  </button>
</div>
      ) : (
        <strong>🏆 {currentBowlingTeam} won the match</strong>
      )
    ) : null}
    {score >= target ||
legalBalls >= maxOvers * 6 ||
wickets >= currentBattingPlayers.length - 1 ? (
  score === target - 1 ? null : (
    <button
      className="match-summary-button"
      onClick={() => {
  if (score >= target) {
    setMatchWinner(currentBattingTeam);
    setMatchResultText(
      `${currentBattingTeam} won by ${
        currentBattingPlayers.length - 1 - wickets
      } wicket${currentBattingPlayers.length - 1 - wickets === 1 ? "" : "s"}`
    );
  } else {
    setMatchWinner(currentBowlingTeam);
    setMatchResultText(
      `${currentBowlingTeam} won by ${target - 1 - score} run${
        target - 1 - score === 1 ? "" : "s"
      }`
    );
  }

  setShowMatchSummary(true);
}}
    >
      VIEW MATCH SUMMARY
    </button>
  )
) : null}
    <button
  className="match-result-undo"
  onClick={undoLastBall}
  disabled={history.length === 0}
>
  ↶ UNDO LAST BALL
</button>
    </div>
  </div>
)}
      </section>
    </div>
  );
}

export default LiveScore;