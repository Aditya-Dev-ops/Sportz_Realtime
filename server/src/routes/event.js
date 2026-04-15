import { Router } from "express";
import { prisma } from "../db/globalPrisma.js";
import { createEventSchema } from "../validation/events.js";

export const eventsRouter = Router();

// ✅ GET all events (with filtering support)
eventsRouter.get("/", async (req, res) => {
  try {
    const { matchId } = req.query;

    const events = await prisma.event.findMany({
      where: matchId ? { matchId: String(matchId) } : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message:"Events Fetched",
      data:events
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch events",
    });
  }
});

// ✅ CREATE EVENT (MAIN LOGIC)
eventsRouter.post("/", async (req, res) => {
  try {
    const parsed = createEventSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid payload",
        details: parsed.error.flatten(),
      });
    }

    const { matchId, minute, over, type, message } = parsed.data;

    // 🔒 Check if match exists
    const matchExists = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!matchExists) {
      return res.status(404).json({
        error: "Match not found",
      });
    }

    // 🧠 Auto-generate message (optional)
    const finalMessage =
      message ||
      `${type} event ${
        minute ? `at ${minute}'` : over ? `at over ${over}` : ""
      }`;

    // ✅ Save event
    const newEvent = await prisma.event.create({
      data: {
        matchId,
        minute,
        over,
        type,
        message: finalMessage,
      },
    });

    // ⚡ Emit real-time update
    req.app.locals.broadcastEvent(newEvent);

    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});