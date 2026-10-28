import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQL_PRIVATE_URL;

const adapter = dbUrl
  ? new PrismaMariaDb(dbUrl)
  : new PrismaMariaDb({
      host: process.env.DATABASE_HOST || process.env.MYSQLHOST || 'localhost',
      user: process.env.DATABASE_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DATABASE_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DATABASE_NAME || process.env.MYSQLDATABASE || 'tp_dsw',
      port: Number(process.env.DATABASE_PORT || process.env.MYSQLPORT || 3306),
    });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Prevent multiple instances in dev (hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}