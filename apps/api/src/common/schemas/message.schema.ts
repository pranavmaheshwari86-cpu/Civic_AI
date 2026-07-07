import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true, index: true })
  conversationId: Types.ObjectId;

  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, default: null })
  intentCategory: string | null;

  @Prop({ type: [Types.ObjectId], default: [] })
  retrievedCatalogIds: Types.ObjectId[];

  @Prop({ type: Number, default: null })
  confidenceScore: number | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
