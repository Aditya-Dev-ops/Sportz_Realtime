import "dotenv/config"
import { prisma } from "./globalPrisma.js";


async function main() {
  console.log("🌱 Seeding started...");

  // 1️⃣ Create Sports
  const cricket = await prisma.sport.upsert({
    where: { name: "CRICKET" },
    update: {},
    create: { name: "CRICKET" },
  });

  const football = await prisma.sport.upsert({
    where: { name: "FOOTBALL" },
    update: {},
    create: { name: "FOOTBALL" },
  });

  // 2️⃣ Create Teams
  const india = await prisma.team.create({
    data: {
      name: "India",
      logo: "india.png",
    },
  });

  const australia = await prisma.team.create({
    data: {
      name: "Australia",
      logo: "australia.png",
    },
  });

  const barcelona = await prisma.team.create({
    data: {
      name: "Barcelona",
    },
  });

  const madrid = await prisma.team.create({
    data: {
      name: "Real Madrid",
    },
  });

  // 3️⃣ Create Players
  await prisma.player.createMany({
    data: [
      { name: "Virat Kohli", teamId: india.id },
      { name: "Rohit Sharma", teamId: india.id },
      { name: "Steve Smith", teamId: australia.id },

      { name: "Lionel Messi", teamId: barcelona.id },
      { name: "Karim Benzema", teamId: madrid.id },
    ],
  });

  // 4️⃣ Create Matches
  const cricketMatch = await prisma.match.create({
    data: {
      title: "India vs Australia",
      sportId: cricket.id,
      homeTeamId: india.id,
      awayTeamId: australia.id,
      status: "LIVE",
      startTime: new Date(),
    },
  });

  const footballMatch = await prisma.match.create({
    data: {
      title: "Barcelona vs Real Madrid",
      sportId: football.id,
      homeTeamId: barcelona.id,
      awayTeamId: madrid.id,
      status: "UPCOMING",
      startTime: new Date(),
    },
  });

  // 5️⃣ Create Initial Events (optional)
  await prisma.event.createMany({
    data: [
      {
        matchId: cricketMatch.id,
        over: "1.1",
        type: "FOUR",
        message: "FOUR! Kohli starts with a boundary!",
      },
      {
        matchId: cricketMatch.id,
        over: "2.3",
        type: "SIX",
        message: "SIX! Massive hit by Rohit Sharma!",
      },
      {
        matchId: footballMatch.id,
        minute: 12,
        type: "GOAL",
        message: "GOAL! Messi scores early!",
      },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// async function main() {
//   console.log("🌱 Seeding database...");

//   // ======================
//   // 1. SPORTS
//   // ======================
//   const cricket = await prisma.sport.upsert({
//     where: { name: "CRICKET" },
//     update: {},
//     create: { name: "CRICKET" },
//   });

//   const football = await prisma.sport.upsert({
//     where: { name: "FOOTBALL" },
//     update: {},
//     create: { name: "FOOTBALL" },
//   });

//   // ======================
//   // 2. TEAMS
//   // ======================
//   const india = await prisma.team.upsert({
//     where: { name: "India" },
//     update: {},
//     create: {
//       name: "India",
//       logo: "india.png",
//     },
//   });

//   const australia = await prisma.team.upsert({
//     where: { name: "Australia" },
//     update: {},
//     create: {
//       name: "Australia",
//       logo: "australia.png",
//     },
//   });

//   const barcelona = await prisma.team.upsert({
//     where: { name: "Barcelona" },
//     update: {},
//     create: {
//       name: "Barcelona",
//     },
//   });

//   const madrid = await prisma.team.upsert({
//     where: { name: "Real Madrid" },
//     update: {},
//     create: {
//       name: "Real Madrid",
//     },
//   });
//   // ======================
//   // 3. PLAYERS
//   // ======================
//   await prisma.player.createMany({
//     data: [
//       { name: "Virat Kohli", teamId: india.id },
//       { name: "Rohit Sharma", teamId: india.id },
//       { name: "Steve Smith", teamId: australia.id },
//       { name: "David Warner", teamId: australia.id },
//     ],
//   });

//   // ======================
//   // 4. MATCHES
//   // ======================
//   const cricketMatch = await prisma.match.create({
//     data: {
//       title: "India vs Australia",
//       sportId: cricket.id,
//       homeTeamId: india.id,
//       awayTeamId: australia.id,
//       startTime: new Date(),
//       endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // +3 hours
//     },
//   });

//   const footballMatch = await prisma.match.create({
//     data: {
//       title: "Barcelona vs Real Madrid",
//       sportId: football.id,
//       homeTeamId: barcelona.id,
//       awayTeamId: madrid.id,
//       startTime: new Date(),
//     },
//   });

//   // ======================
//   // 5. EVENTS (COMMENTARY)
//   // ======================
//   await prisma.event.createMany({
//     data: [
//       {
//         matchId: cricketMatch.id,
//         over: "1.1",
//         type: "FOUR",
//         message: "Kohli hits a beautiful cover drive!",
//       },
//       {
//         matchId: cricketMatch.id,
//         over: "2.3",
//         type: "WICKET",
//         message: "Rohit Sharma is OUT!",
//       },
//       {
//         matchId: footballMatch.id,
//         minute: 10,
//         type: "GOAL",
//         message: "Barcelona scores first goal!",
//       },
//     ],
//   });

//   console.log("✅ Database seeded successfully!");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });