import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_NAME = process.env.DATABASE_NAME; 

const adapter = new PrismaMariaDb({
  
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
});

// FIXME: Exporting a new PrismaClient instance directly can create multiple connections in dev with hot-reload or when the module is loaded more than once. Consider using a singleton pattern (cache on globalThis in Node) so the app reuses one PrismaClient instance and avoids exhausting the DB connection pool.
export const prisma = new PrismaClient({ adapter });