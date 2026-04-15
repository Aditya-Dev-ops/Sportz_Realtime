import { z } from "zod";

//////////////////////////////
// SCHEMAS
//////////////////////////////

export const createEventSchema = z.object({
  matchId: z.string().uuid("Invalid matchId"),

  minute: z.number().int().min(0).optional(),
  over: z.string().optional(),

  type: z.string().min(1, "Event type required"),
  message: z.string().min(1, "Message required"),
});

export const eventIdParams = z.object({
  id: z.string().uuid("Invalid event id"),
});