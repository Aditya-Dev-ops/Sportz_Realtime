import { Router } from "express";
import { prisma } from "../db/globalPrisma.js";
import { createSportSchema } from "../validation/sports.js";

export const sportRouter = Router();

//////////////////////////////
// GET ALL SPORTS
//////////////////////////////
sportRouter.get("/", async (req, res) => {
  try {
    const sports = await prisma.sport.findMany();

    return res.status(200).json({
      message: "Sports fetched successfully",
      data: sports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

//////////////////////////////
// CREATE SPORT
//////////////////////////////
sportRouter.post("/", async (req, res) => {
  try {
    const parsed = createSportSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid payload",
        details: parsed.error.flatten(),
      });
    }

    const { name } = parsed.data;

    // prevent duplicate sport (since enum is unique)
    const existing = await prisma.sport.findUnique({
      where: { name },
    });

    if (existing) {
      return res.status(409).json({
        error: "Sport already exists",
      });
    }

    const sport = await prisma.sport.create({
      data: { name },
    });

    return res.status(201).json({
      message: "Sport created successfully",
      data: sport,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
});