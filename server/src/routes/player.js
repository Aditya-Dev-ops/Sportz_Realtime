// import { Router } from "express";
// import { prisma } from "../db/globalPrisma.js";
// import { createPlayerSchema , updatePlayerSchema , playerIdParams } from "../validation/players.js";
// import { ParsedError } from "../utils/customError.js";
// import { id } from "zod/v4/locales";
// import { includes } from "zod";

// export const playerRouter = Router();


// playerRouter.get("/:id" , async (req , res)=>{
//   const parsed = playerIdParams.safeParse(req.params);
//   if(!parsed.success){
//    return res.status(400).json({
//     error:"Invalid payload",
//     details: parsed.error.flatten(),
//    })
//     }

//   const player = await prisma.player.findUnique({
//     where:{
//       id: parsed.data.id,
//     },
//     include:{team:true},
//   });
//    if(!player){
//     res.status(404).json({
//       error:"player not found",
//    })
//    }
//   res.status(200).json(player);
// });

// // GET players (optionally filter by team)
// playerRouter.get("/", async (req, res) => {
//   try {
//     const { teamId } = req.query;

//     const players = await prisma.player.findMany({
//       where: teamId ? { teamId } : undefined,
//       include: {
//         team: true,
//       },
//     });

//     res.status(200).json(players);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch players" });
//   }
// });



// // CREATE player
// playerRouter.post("/", async (req, res) => {
//   try {
//     const parsed =  createPlayerSchema.safeParse(req.body);

//     if (!parsed.success) {
//       return res.status(400).json({
//         error: "Invalid payload",
//         details: parsed.error.flatten(),
//       });
//     }

//     const { name, teamId } = parsed.data;

//     // 🔒 check team exists
//     const team = await prisma.team.findUnique({
//       where: { id: teamId },
//     });

//     if (!team) {
//       return res.status(404).json({
//         error: "Team not found",
//       });
//     }

//     const player = await prisma.player.create({
//       data: {
//         name,
//         teamId,
//       },
//     });

//     res.status(201).json(player);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: "Something went wrong",
//     });
//   }
// });

// // Update Player

// playerRouter.patch("/:id", async (req , res)=>{
//   try{
//   const bodyparsed = updatePlayerSchema.safeParse(req.body);
//   const paramsparsed = playerIdParams.safeParse(req.params);

//   if(!bodyparsed.success || !paramsparsed.success){
//     return res.status(400).json({
//       error:"Invalid input",
//     });
//   };

//   const {id} = paramsparsed.data;
  
//   if(bodyparsed.data.teamId){
//     const team = await prisma.team.findUnique({
//       where: { id: bodyparsed.data.teamId },
//     });

//     if (!team) {
//       return res.status(404).json({
//         error: "Team not found",
//       });
//     }
//   };

//   const updated = await prisma.player.update({
//     where: { id },
//     data: bodyparsed.data,
//   });
//   res.json(updated);
// } catch (err) {
//   console.error(err);
//   res.status(500).json({
//     error: "Something went wrong",
//   });
// }
// });


// playerRouter.delete("/:id", async (req ,res) =>{
//   try {
    
  
//   const parsed = playerIdParams.safeParse(req.params);

//   if(!parsed.success){
//     return res.status(400).json({error: "inputs are not correct"});
//   };

//   const isPlayer  = await prisma.player.findUnique({
//     where:{
//       id:parsed.data.id
//     }
//   });
//   if(!isPlayer){
//     return res.status(400).json({error: "Player not found"});
//   }
   
//   await prisma.player.delete({
//     where:{
//       id:parsed.data.id
//     },
//   });
//   res.status(400).json({message:"Player deleted"});
// } catch (error) {
//     res.status(400).json({
//       error:error.message
// })
// };

// })

import { Router } from "express";
import { prisma } from "../db/globalPrisma.js";
import {
  createPlayerSchema,
  updatePlayerSchema,
  playerIdParams,
} from "../validation/players.js";

export const playerRouter = Router();

//////////////////////////////
// GET PLAYER BY ID
//////////////////////////////
playerRouter.get("/:id", async (req, res) => {
  const parsed = playerIdParams.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid player ID",
      details: parsed.error.flatten(),
    });
  }

  const player = await prisma.player.findUnique({
    where: { id: parsed.data.id },
    include: { team: true },
  });

  if (!player) {
    return res.status(404).json({
      error: "Player not found",
    });
  }

  return res.status(200).json(player);
});

//////////////////////////////
// GET ALL PLAYERS
//////////////////////////////
playerRouter.get("/", async (req, res) => {
  try {
    const { teamId } = req.query;

    const players = await prisma.player.findMany({
      where: teamId ? { teamId: String(teamId) } : undefined,
      include: { team: true },
    });

    return res.status(200).json(players);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch players",
    });
  }
});

//////////////////////////////
// CREATE PLAYER
//////////////////////////////
playerRouter.post("/", async (req, res) => {
  try {
    const parsed = createPlayerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid payload",
        details: parsed.error.flatten(),
      });
    }

    const { name, teamId } = parsed.data;

    // check team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({
        error: "Team not found",
      });
    }

    const player = await prisma.player.create({
      data: { name, teamId },
    });

    return res.status(201).json(player);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
});

//////////////////////////////
// UPDATE PLAYER
//////////////////////////////
playerRouter.patch("/:id", async (req, res) => {
  try {
    const bodyParsed = updatePlayerSchema.safeParse(req.body);
    const paramsParsed = playerIdParams.safeParse(req.params);

    if (!bodyParsed.success || !paramsParsed.success) {
      return res.status(400).json({
        error: "Invalid input",
      });
    }

    const { id } = paramsParsed.data;

    // if teamId is being updated → check existence
    if (bodyParsed.data.teamId) {
      const team = await prisma.team.findUnique({
        where: { id: bodyParsed.data.teamId },
      });

      if (!team) {
        return res.status(404).json({
          error: "Team not found",
        });
      }
    }

    const updated = await prisma.player.update({
      where: { id },
      data: bodyParsed.data,
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
});

//////////////////////////////
// DELETE PLAYER
//////////////////////////////
playerRouter.delete("/:id", async (req, res) => {
  try {
    const parsed = playerIdParams.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid player ID",
      });
    }

    const existing = await prisma.player.findUnique({
      where: { id: parsed.data.id },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Player not found",
      });
    }

    await prisma.player.delete({
      where: { id: parsed.data.id },
    });

    return res.status(200).json({
      message: "Player deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
});