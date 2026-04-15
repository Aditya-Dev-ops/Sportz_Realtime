import { z } from "zod";

//////////////////////////////
// SCHEMAS
//////////////////////////////

export const createPlayerSchema = z.object({
  name: z.string().min(1, "Player name is required"),
  teamId: z.string().uuid("Invalid teamId"),
});

export const updatePlayerSchema = z.object({
  name: z.string().min(1).optional(),
  teamId: z.string().uuid().optional(),
});

export const playerIdParams = z.object({
  id: z.string().uuid("Invalid player id"),
});