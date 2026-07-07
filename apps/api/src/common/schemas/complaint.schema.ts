import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComplaintDocument = Complaint & Document;

@Schema({ _id: false })
class ComplaintLocation {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;

  @Prop({ type: String, default: null })
  address: string | null;

  @Prop({ type: String, default: null })
  landmark: string | null;
}

@Schema({ _id: false })
class GeoPoint {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ required: true, unique: true, index: true })
  trackingId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['road_infrastructure', 'water_supply', 'sanitation_waste', 'streetlight_electrical', 'public_safety', 'other'],
  })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: ComplaintLocation, required: true })
  location: ComplaintLocation;

  @Prop({ type: GeoPoint, required: true })
  geoLocation: GeoPoint;

  @Prop({ type: [String], default: [] })
  photoUrls: string[];

  @Prop({ default: 'submitted', enum: ['submitted', 'under_review', 'in_progress', 'resolved', 'closed'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Complaint', default: null })
  duplicateOfComplaintId: Types.ObjectId | null;

  @Prop({ default: 'high', enum: ['high', 'low'] })
  confidenceFlag: string;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
ComplaintSchema.index({ geoLocation: '2dsphere' });
ComplaintSchema.index({ category: 1, createdAt: -1 });
