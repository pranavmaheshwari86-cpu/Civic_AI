import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema } from '../common/schemas/admin-user.schema';
import { ServiceCatalog, ServiceCatalogSchema } from '../common/schemas/catalog.schema';
import { Complaint, ComplaintSchema } from '../common/schemas/complaint.schema';
import { ComplaintStatusUpdate, ComplaintStatusUpdateSchema } from '../common/schemas/complaint-status-update.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: ServiceCatalog.name, schema: ServiceCatalogSchema },
      { name: Complaint.name, schema: ComplaintSchema },
      { name: ComplaintStatusUpdate.name, schema: ComplaintStatusUpdateSchema },
    ]),
    BullModule.registerQueue({ name: 'catalog-embeddings' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ADMIN_JWT_SECRET') || 'admin_default_secret',
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminJwtStrategy],
})
export class AdminModule {}
