import { useState } from "react";
import { createEvent } from "../api/api";

const Commentary = ({ events, matchId, isAdmin = true }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("INFO");

  const handleSubmit = async () => {
    if (!message) return;

    const payload = {
      matchId,
      type,
      message,
    };

    try {
      await createEvent(payload);
      setMessage("");
    } catch (err) {
      console.error("Failed to send event", err);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Live Commentary</h3>

      {/* 🔥 ADMIN INPUT */}
      {isAdmin && (
        <div style={{ marginBottom: "15px" }}>
         
         <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="RUN">RUN</option>
          <option value="FOUR">FOUR</option>
          <option value="SIX">SIX</option>
          <option value="WICKET">WICKET</option>
          <option value="DOT">DOT BALL</option>
          <option value="WIDE">WIDE</option>
          <option value="NO_BALL">NO BALL</option>
        </select>
          <input
            type="text"
            placeholder="Enter commentary..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ marginLeft: "10px" }}
          />

          <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
            Send
          </button>
        </div>
      )}

      {/* 🔥 COMMENTARY LIST */}
      {events.map((event) => (
        <div
          key={event.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "8px",
          }}
        >
          <strong>{event.type}</strong> - {event.message}
        </div>
      ))}
    </div>
  );
};

export default Commentary;