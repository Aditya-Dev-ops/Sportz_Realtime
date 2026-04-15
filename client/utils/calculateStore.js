export const calculateScore = (events) => {
    let runs = 0;
    let wickets = 0;
    let balls = 0;
  
    events.forEach((event) => {
      switch (event.type) {
        case "FOUR":
          runs += 4;
          balls += 1;
          break;
  
        case "SIX":
          runs += 6;
          balls += 1;
          break;
  
        case "RUN":
          runs += 1;
          balls += 1;
          break;
  
        case "WICKET":
          wickets += 1;
          balls += 1;
          break;
  
        case "DOT":
          balls += 1;
          break;
  
        case "WIDE":
          runs += 1;
          break;
  
        case "NO_BALL":
          runs += 1;
          break;
  
        default:
          break;
      }
    });
  
    const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
    const runRate = balls > 0 ? ((runs / balls) * 6).toFixed(2) : 0;
  
    return {
      runs,
      wickets,
      overs,
      balls,
      runRate,
    };
  };