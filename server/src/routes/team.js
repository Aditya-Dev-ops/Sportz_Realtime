import { Router } from "express";
import { prisma } from "../db/globalPrisma.js";
import { createTeamSchema } from "../validation/teams.js";
import { ParsedError } from "../utils/customError.js";

export const teamRouter = Router();

//////////////////////////////
// GET ALL TEAMS
//////////////////////////////
teamRouter.get("/", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: true,
      },
    });

    return res.status(200).json({
      message: "Teams fetched successfully",
      data: teams,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

//////////////////////////////
// CREATE TEAM
//////////////////////////////
teamRouter.post("/", async (req, res) => {
  try {
    const parsed = createTeamSchema.safeParse(req.body);

    if (!parsed.success) {
      return ParsedError(res, parsed);
    }

    const { name, logo } = parsed.data;

    // check duplicate
    const existing = await prisma.team.findFirst({
      where: { name },
    });

    if (existing) {
      return res.status(409).json({
        error: "Team already exists",
      });
    }

    const team = await prisma.team.create({
      data: {
        name,
        logo,
      },
    });

    return res.status(201).json({
      message: "Team created successfully",
      data: team,
    });
  } catch (err) {
    console.error("Error creating team:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});