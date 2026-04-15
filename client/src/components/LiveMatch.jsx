import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { fetchEvents } from "../api/api";
import ScoreBoard from "./ScoreBoard";
import Commentary from "./Commentary";
import MatchList from "./MatchList";

// const LiveMatch = ({ match  , onSelectMatch , counter , setCounter}) => {
//   const [events, setEvents] = useState([]);
   
//   useEffect(() => {
//     if (!match?.id) return;

//     // fetch initial events
//     fetchEvents(match.id).then((res) => {
//       setEvents(res.data || []);
//     });

//     // join socket room
//     socket.emit("join_match", match.id);

//     // listen for new events
//     socket.on("new_event", (event) => {
//       if (event.matchId === match.id) {
//         setEvents((prev) => [event, ...prev]);
//       }
//     });

//     return () => {
//       socket.emit("leave_match", match.id);
//       socket.off("new_event");
//     };
//   }, [match]);

//   return (
//     <div>
//       <h2>{match.title}</h2>
//       <ScoreBoard events={events} />
//       <Commentary events={events} />
//       <button onClick={() => onSelectMatch("")}>
//        ⬅️ Back
//       </button>
//       <div>
//         <button onClick={()=> (setCounter((prev) => prev + 1))}>
//             +
//         </button>
//         {counter}
//         <button
//         onClick={() => (setCounter((prev) => prev - 1))}
//         >
//             -
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LiveMatch;


const LiveMatch = ({ match, onSelectMatch, counter, setCounter }) => {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      if (!match?.id) return;
  
      fetchEvents(match.id).then((res) => {
        setEvents(res.data || []);
      });
  
      socket.emit("join_match", match.id);
  
      const handleNewEvent = (event) => {
        if (event.matchId === match.id) {
          setEvents((prev) => [event, ...prev]);
        }
      };
  
      socket.on("new_event", handleNewEvent);
  
      return () => {
        socket.emit("leave_match", match.id);
        socket.off("new_event", handleNewEvent);
      };
    }, [match]);
  
    return (
      <div>
        <h2>{match.title}</h2>
  
        <ScoreBoard events={events} />
        <Commentary events={events}  matchId={match.id}/>
  
        <button
         style={{position:"absolute",left:"10px" , top:"10px"}} 
        onClick={() => onSelectMatch(null)}>
          ⬅️ Back
        </button>
      </div>
    );
  };

  export default LiveMatch;