const BASE_URL = "http://localhost:8000";

export const fetchMatches = async () => {
  const res = await fetch(`${BASE_URL}/matches`);
  return res.json();
};


export const fetchEvents = async (matchId) => {
    try {
      const res = await fetch(`${BASE_URL}/events?matchId=${matchId}`);
  
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching events:", error);
      return { data: [] }; // fallback to avoid crash
    }
  };


export const createEvent = async (data) => {
  const res = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};