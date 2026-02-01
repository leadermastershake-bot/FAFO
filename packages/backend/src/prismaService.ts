import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

export async function checkDatabaseConnection() {
  try {
    // In MongoDB, we can try to list collections or just do a simple find
    await prisma.$runCommandRaw({ ping: 1 });
    return true;
  } catch (error) {
    // console.error('Database connection failed:', error);
    return false;
  }
}
