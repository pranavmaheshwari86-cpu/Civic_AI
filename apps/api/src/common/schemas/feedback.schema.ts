import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: Types.ObjectId, ref: 'Message', required: true, unique: true, index: true })
  messageId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ required: true, enum: ['up', 'down'] })
  rating: string;

  @Prop({ type: String, default: null })
  comment: string | null;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
