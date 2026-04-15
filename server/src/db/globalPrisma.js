import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = globalThis;

const connectionString = `${process.env.DATABASE_URL}`;
// adapter for add url

  const adapter = connectionString && new PrismaPg({connectionString});
  
  export const prisma =
  globalForPrisma.prisma || new PrismaClient({
    adapter
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}