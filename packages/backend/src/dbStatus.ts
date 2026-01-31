import prisma from './prismaService';

let isConnected = false;

export const checkDbConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    isConnected = true;
    console.log('Database connection successful.');
  } catch (error) {
    isConnected = false;
    console.warn('Database connection failed. Application will run in a degraded state.');
  } finally {
    await prisma.$disconnect();
  }
};

export const getDbStatus = (): { dbStatus: 'connected' | 'disconnected' } => {
  return {
    dbStatus: isConnected ? 'connected' : 'disconnected',
  };
};
