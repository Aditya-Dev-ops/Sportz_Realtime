import { calculateScore } from "../../utils/calculateStore";

const ScoreBoard = ({ events }) => {
  const { runs, wickets, overs, runRate } = calculateScore(events);

  return (
    <div
      style={{
        border: "2px solid black",
        padding: "15px",
        marginTop: "20px",
      }}
    >
      <h2>🏏 Live Score</h2>

      <h1>
        {runs}/{wickets}
      </h1>

      <p>Overs: {overs}</p>
      <p>Run Rate: {runRate}</p>
    </div>
  );
};

export default ScoreBoard;