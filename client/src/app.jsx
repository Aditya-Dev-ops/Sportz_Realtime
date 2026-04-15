import { useState } from "react";
import MatchList from "./components/MatchList";
import LiveMatch from "./components/LiveMatch";

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null)
  console.log(selectedMatch , "This is console")
  
  return (
    <div>
      {selectedMatch === null ? (
        <MatchList onSelectMatch={setSelectedMatch} />
      ) : (
        <LiveMatch match={selectedMatch}  onSelectMatch={setSelectedMatch}
        />
      )}
    </div>
  );
}

export default App;