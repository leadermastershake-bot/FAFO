import { PrismaClient, FeedbackType } from '@prisma/client';

const prisma = new PrismaClient();

export class FeedbackService {
  /**
   * Creates a feedback entry for a specific AI action.
   * @param actionId The ID of the AIAction to which the feedback applies.
   * @param type The type of feedback (POSITIVE or NEGATIVE).
   * @param comment An optional comment from the user.
   * @returns The newly created feedback entry.
   */
  async createFeedback(actionId: string, type: FeedbackType, comment?: string) {
    const feedback = await prisma.userFeedback.create({
      data: {
        actionId,
        type,
        comment,
      },
    });
    return feedback;
  }
}
