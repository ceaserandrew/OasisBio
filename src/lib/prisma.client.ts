// Mock version of prisma for client-side use
// This prevents client-side code from importing the real prisma client

export const prisma = {
  user: {
    findUnique: async () => null,
  },
};