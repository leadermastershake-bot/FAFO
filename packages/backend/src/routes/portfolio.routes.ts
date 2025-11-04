import express from 'express';
import { PortfolioService } from '../services/PortfolioService';
import { AICoreService } from '../services/AICoreService';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const portfolioService = new PortfolioService();
const aiCoreService = new AICoreService();
const prisma = new PrismaClient(); // Used for fetching a test user

// Middleware to get a test user ID
// In a real app, this would come from an authentication middleware (e.g., JWT)
const getTestUserId = async () => {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        name: 'Test User',
      },
    });
  }
  return user.id;
};

// GET /api/portfolio
router.get('/', async (req, res) => {
  try {
    const userId = await getTestUserId(); // Replace with actual user ID from auth
    const portfolio = await portfolioService.getOrCreatePortfolio(userId);
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve portfolio' });
  }
});

// POST /api/portfolio/holding
router.post('/holding', async (req, res) => {
  const { asset, quantity, averageCost } = req.body;
  if (!asset || quantity === undefined || averageCost === undefined) {
    return res.status(400).json({ error: 'Missing required fields: asset, quantity, averageCost' });
  }

  try {
    const userId = await getTestUserId(); // Replace with actual user ID from auth
    const updatedPortfolio = await portfolioService.upsertHolding(userId, asset, quantity, averageCost);
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add or update holding' });
  }
});

// DELETE /api/portfolio/holding/:asset
router.delete('/holding/:asset', async (req, res) => {
  const { asset } = req.params;
  try {
    const userId = await getTestUserId(); // Replace with actual user ID from auth
    const updatedPortfolio = await portfolioService.removeHolding(userId, asset);
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove holding' });
  }
});

// GET /api/portfolio/assessment
router.get('/assessment', async (req, res) => {
    try {
      const userId = await getTestUserId(); // Replace with actual user ID from auth
      const assessment = await aiCoreService.assessPortfolio(userId);
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate portfolio assessment' });
    }
});

export default router;
