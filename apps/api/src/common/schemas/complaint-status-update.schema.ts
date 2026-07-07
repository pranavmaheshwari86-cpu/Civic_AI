import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComplaintStatusUpdateDocument = ComplaintStatusUpdate & Document;

@Schema({ timestamps: true })
export class ComplaintStatusUpdate {
  @Prop({ type: Types.ObjectId, ref: 'Complaint', required: true, index: true })
  complaintId: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop({ type: String, default: null })
  note: string | null;

  @Prop({ required: true })
  updatedBy: string;
}

export const ComplaintStatusUpdateSchema = SchemaFactory.createForClass(ComplaintStatusUpdate);
