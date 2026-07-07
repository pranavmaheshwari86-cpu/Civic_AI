import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminUserDocument = AdminUser & Document;

@Schema({ timestamps: true })
export class AdminUser {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['editor', 'admin'], default: 'editor' })
  role: string;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
