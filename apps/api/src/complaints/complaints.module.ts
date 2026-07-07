import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Complaint, ComplaintSchema } from '../common/schemas/complaint.schema';
import { ComplaintStatusUpdate, ComplaintStatusUpdateSchema } from '../common/schemas/complaint-status-update.schema';
import { User, UserSchema } from '../common/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
      { name: ComplaintStatusUpdate.name, schema: ComplaintStatusUpdateSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, UploadService],
})
export class ComplaintsModule {}
