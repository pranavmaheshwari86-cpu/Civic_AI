import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ type: String, default: null })
  anonymousSessionId: string | null;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ default: 'active' })
  status: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
