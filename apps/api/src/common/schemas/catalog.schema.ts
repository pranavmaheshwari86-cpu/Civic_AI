import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServiceCatalogDocument = ServiceCatalog & Document;

@Schema({ _id: false })
class MultiLangText {
  @Prop({ required: true })
  en: string;

  @Prop({ required: true })
  hi: string;
}

@Schema({ _id: false })
class RequiredDocument {
  @Prop({ type: MultiLangText, required: true })
  label: MultiLangText;

  @Prop({ type: String, default: null })
  conditionalOn: string | null;
}

@Schema({ timestamps: true, collection: 'service_catalog' })
export class ServiceCatalog {
  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: MultiLangText, required: true })
  description: MultiLangText;

  @Prop({ type: [RequiredDocument], default: [] })
  requiredDocuments: RequiredDocument[];

  @Prop({ required: true })
  officialPortalUrl: string;

  @Prop({ type: [String], default: [] })
  applicableStates: string[];

  @Prop({ type: [Number], default: [] })
  embedding: number[];

  @Prop({ type: Date, default: null })
  lastReviewedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  reviewedBy: Types.ObjectId | null;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceCatalogSchema = SchemaFactory.createForClass(ServiceCatalog);
ServiceCatalogSchema.index({ category: 1 });
ServiceCatalogSchema.index({ isActive: 1 });
