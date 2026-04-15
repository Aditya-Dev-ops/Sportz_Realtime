import { Router } from "express";
import { createMatchSchema } from "../validation/matches.js";
import { prisma } from "../db/globalPrisma.js";

export const matchRouter = Router();

//////////////////////////////
// GET ALL MATCHES
//////////////////////////////
matchRouter.get("/", async (req, res) => {
  try {
    const matches = await prisma.match.findMany();

    return res.status(200).json({
      message: "Matches fetched successfully",
      data: matches,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch matches",
    });
  }
});

//////////////////////////////
// CREATE MATCH
//////////////////////////////
matchRouter.post("/", async (req, res) => {
  try {
    const parsed = createMatchSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid payload",
        details: parsed.error.flatten(),
      });
    }

    const {
      title,
      sportId,
      homeTeamId,
      awayTeamId,
      status,
      startTime,
      endTime,
    } = parsed.data;

    // ❗ extra validations
    if (homeTeamId === awayTeamId) {
      return res.status(400).json({
        error: "Home and Away team cannot be same",
      });
    }

    const [sport, homeTeam, awayTeam] = await Promise.all([
      prisma.sport.findUnique({ where: { id: sportId } }),
      prisma.team.findUnique({ where: { id: homeTeamId } }),
      prisma.team.findUnique({ where: { id: awayTeamId } }),
    ]);

    if (!sport) {
      return res.status(404).json({ error: "Sport not found" });
    }

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    const match = await prisma.match.create({
      data: {
        title,
        sportId,
        homeTeamId,
        awayTeamId,
        status,
        startTime,
        endTime,
      },
    });

    req.app.locals.broadcastMatchCreated(match);

    return res.status(201).json({
      message: "Match created successfully",
      data: match,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});