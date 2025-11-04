import express from 'express';
import { FeedbackService } from '../services/FeedbackService';
import { FeedbackType } from '@prisma/client';

const router = express.Router();
const feedbackService = new FeedbackService();

// POST /api/feedback
router.post('/', async (req, res) => {
  const { actionId, type, comment } = req.body;

  if (!actionId || !type) {
    return res.status(400).json({ error: 'Missing required fields: actionId, type' });
  }

  if (type !== FeedbackType.POSITIVE && type !== FeedbackType.NEGATIVE) {
    return res.status(400).json({ error: 'Invalid feedback type' });
  }

  try {
    const feedback = await feedbackService.createFeedback(actionId, type, comment);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

export default router;
