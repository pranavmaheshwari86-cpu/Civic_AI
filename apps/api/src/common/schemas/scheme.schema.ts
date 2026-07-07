import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SchemeCatalogDocument = SchemeCatalog & Document;

@Schema({ _id: false })
class MultiLangText {
  @Prop({ required: true })
  en: string;

  @Prop({ required: true })
  hi: string;
}

@Schema({ _id: false })
class EligibilityCriteria {
  @Prop({ type: Number, default: null })
  ageMin: number | null;

  @Prop({ type: Number, default: null })
  ageMax: number | null;

  @Prop({ type: [String], default: [] })
  occupationTypes: string[];

  @Prop({ type: [String], default: [] })
  applicableStates: string[];

  @Prop({ type: String, default: null })
  genderRestriction: string | null;

  @Prop({ type: Number, default: null })
  incomeThresholdMax: number | null;
}

@Schema({ timestamps: true, collection: 'scheme_catalog' })
export class SchemeCatalog {
  @Prop({ required: true })
  schemeName: string;

  @Prop({ type: MultiLangText, required: true })
  description: MultiLangText;

  @Prop({ type: EligibilityCriteria, required: true })
  eligibilityCriteria: EligibilityCriteria;

  @Prop({ type: MultiLangText, required: true })
  benefitsDescription: MultiLangText;

  @Prop({ required: true })
  applicationUrl: string;

  @Prop({ required: true })
  department: string;

  @Prop({ type: [Number], default: [] })
  embedding: number[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastReviewedAt: Date | null;
}

export const SchemeCatalogSchema = SchemaFactory.createForClass(SchemeCatalog);
SchemeCatalogSchema.index({ isActive: 1 });
