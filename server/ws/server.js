import { Server } from "socket.io";

export function attachWebSocketServer(server) {
  console.log("Server created")
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    //////////////////////////////
    // JOIN MATCH
    //////////////////////////////
    socket.on("join_match", (matchId) => {
      try {
        console.log(matchId);
        if (!matchId || typeof matchId !== "string") return;
        socket.join(matchId);
        
        // emit back confirmation
        socket.emit("subscribed", { matchId });

        // 🔥 send viewer count
        const roomSize = io.sockets.adapter.rooms.get(matchId)?.size || 0;
        io.to(matchId).emit("viewer_count", roomSize);
        console.log(`Socket ${socket.id} joined match ${matchId}`);
      } catch (err) {
        console.error("join_match error:", err);
      }
    });

    //////////////////////////////
    // LEAVE MATCH
    //////////////////////////////
    socket.on("leave_match", (matchId) => {
      try {
        socket.leave(matchId);

        socket.emit("unsubscribed", { matchId });

        const roomSize = io.sockets.adapter.rooms.get(matchId)?.size || 0;
        io.to(matchId).emit("viewer_count", roomSize);
      } catch (err) {
        console.error("leave_match error:", err);
      }
    });

    //////////////////////////////
    // DISCONNECT
    //////////////////////////////
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  //////////////////////////////
  // BROADCAST FUNCTIONS
  //////////////////////////////

  function broadcastMatchCreated(match) {
    io.emit("match_created", match);
  }

  function broadcastEvent(event) {
    io.to(event.matchId).emit("new_event", event);
  }

  function broadcastMatchStatus(match) {
    io.to(match.id).emit("match_status_update", match);
  }

  return {
    io,
    broadcastMatchCreated,
    broadcastEvent,
    broadcastMatchStatus,
  };
};