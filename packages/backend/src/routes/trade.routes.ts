import express from 'express';
import { TradeService } from '../services/TradeService';
import { RatingService } from '../services/RatingService';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const tradeService = new TradeService();
const ratingService = new RatingService();
const prisma = new PrismaClient(); // Used for fetching a test user

// A mock function to get the current user's ID
// In a real app, this would come from an authentication middleware
const getTestUserId = async () => {
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: { email: 'trade-user@example.com', name: 'Trader Joe' },
        });
    }
    return user.id;
};

// GET /api/trades
router.get('/', async (req, res) => {
    try {
        const userId = await getTestUserId();
        const trades = await tradeService.getTradesForUser(userId);
        res.json(trades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trades' });
    }
});

// POST /api/trades
router.post('/', async (req, res) => {
    const { actionId, asset, quantity, entryPrice } = req.body;
    if (!actionId || !asset || quantity === undefined || entryPrice === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const trade = await tradeService.createTrade(actionId, asset, quantity, entryPrice);
        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create trade' });
    }
});

// POST /api/trades/:tradeId/close
router.post('/:tradeId/close', async (req, res) => {
    const { tradeId } = req.params;
    const { exitPrice } = req.body;
    if (exitPrice === undefined) {
        return res.status(400).json({ error: 'Missing required field: exitPrice' });
    }
    try {
        const updatedTrade = await tradeService.closeTrade(tradeId, exitPrice);
        res.json(updatedTrade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to close trade' });
    }
});

// GET /api/trades/:tradeId/rating
router.get('/:tradeId/rating', async (req, res) => {
    const { tradeId } = req.params;
    try {
        const trade = await prisma.executedTrade.findUnique({ where: { id: tradeId } });
        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        const rating = await ratingService.rateTrade(trade);
        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: 'Failed to rate trade' });
    }
});

export default router;
