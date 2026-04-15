import { z } from "zod";

//////////////////////////////
// ENUM
//////////////////////////////

export const sport_type = {
  cricket: "CRICKET",
  football: "FOOTBALL",
  rugby: "RUGBY",
  tennis: "TENNIS",
  other: "OTHER",
};

//////////////////////////////
// SCHEMAS
//////////////////////////////

export const createSportSchema = z.object({
  name: z.enum(Object.values(sport_type)),
});

export const sportIdParams = z.object({
  id: z.string().uuid("Invalid sport id"),
});