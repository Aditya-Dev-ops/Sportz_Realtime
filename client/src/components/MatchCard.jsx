const MatchCard = ({ match, onClick }) => {
    return (
      <div
        onClick={() => onClick(match)}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px",
          cursor: "pointer",
        }}
      >
        <h3>{match.title}</h3>
        <p>Status: {match.status}</p>
      </div>
    );
  };
  
  export default MatchCard;