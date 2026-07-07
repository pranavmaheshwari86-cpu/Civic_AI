import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback, FeedbackDocument } from '../common/schemas/feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async submitFeedback(messageId: string, rating: 'up' | 'down', comment?: string) {
    const feedback = await this.feedbackModel.create({
      messageId: new Types.ObjectId(messageId),
      conversationId: new Types.ObjectId(),
      rating,
      comment: comment || null,
    });
    return { id: (feedback._id as Types.ObjectId).toHexString() };
  }
}
