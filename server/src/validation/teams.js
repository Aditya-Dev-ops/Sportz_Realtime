import { z } from "zod";

//////////////////////////////
// SCHEMAS
//////////////////////////////

export const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  logo: z.string().url().optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  logo: z.string().url().optional(),
});

export const teamIdParams = z.object({
  id: z.string().uuid("Invalid team id"),
});