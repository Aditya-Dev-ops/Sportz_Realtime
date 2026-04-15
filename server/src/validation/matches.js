import { z } from "zod";

//////////////////////////////
// CONSTANTS
//////////////////////////////

export const match_status = {
  scheduled: "UPCOMING",
  live: "LIVE",
  finished: "FINISHED",
};

//////////////////////////////
// QUERY VALIDATION
//////////////////////////////

export const listMatchesQuery = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

//////////////////////////////
// PARAMS VALIDATION
//////////////////////////////

export const matchIdParams = z.object({
  id: z.string().uuid({
    message: "Invalid match id",
  }),
});

//////////////////////////////
// MATCH SCHEMA (CREATE)
//////////////////////////////

export const createMatchSchema = z.object({
  title: z.string().min(1, "Title is required"),

  sportId: z.string().uuid("Invalid sportId"),

  homeTeamId: z.string().uuid("Invalid homeTeamId"),
  awayTeamId: z.string().uuid("Invalid awayTeamId"),

  status: z
    .enum([
      match_status.scheduled,
      match_status.live,
      match_status.finished,
    ])
    .optional(),

  startTime: z.coerce.date({
    message: "Invalid startTime",
  }),
  endTime: z.coerce.date({
    message: "Invalid endTime",
  })
});

//////////////////////////////
// MATCH SCHEMA (UPDATE)
//////////////////////////////

export const updateMatchSchema = z.object({
  title: z.string().min(1).optional(),

  sportId: z.string().uuid().optional(),

  homeTeamId: z.string().uuid().optional(),
  awayTeamId: z.string().uuid().optional(),

  status: z
    .enum([
      match_status.scheduled,
      match_status.live,
      match_status.finished,
    ])
    .optional(),

  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});