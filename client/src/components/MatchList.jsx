import { useEffect, useState } from "react";
import { fetchMatches } from "../api/api";
import MatchCard from "./MatchCard";

const MatchList = ({ onSelectMatch }) => {
  const [matches, setMatches] = useState([]);
  console.log("MAtch list ")
  useEffect(() => {
    fetchMatches().then((res) => {
      setMatches(res.data || []);
    });
  }, []);

  return (
    <div>
      <h2>Matches</h2>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onClick={onSelectMatch} />
      ))
      }
    </div>
  );
};

export default MatchList;