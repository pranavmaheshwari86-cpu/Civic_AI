import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { AdminJwtAuthGuard } from './admin-jwt-auth.guard';
import { AdminRoleGuard } from '../common/guards/admin-role.guard';

class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

class CreateCatalogDto {
  @IsString() serviceName: string;
  @IsString() department: string;
  @IsString() category: string;
  @IsString() officialPortalUrl: string;
  description: { en: string; hi: string };
  requiredDocuments?: Array<{ label: { en: string; hi: string }; conditionalOn: string | null }>;
  applicableStates?: string[];
}

class UpdateStatusDto {
  @IsString() status: string;
  @IsString() @IsOptional() note?: string;
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth/login')
  @HttpCode(200)
  async login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto.email, dto.password);
  }

  @UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
  @Get('catalog/services')
  async listCatalog(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.listCatalog(parseInt(page || '1', 10), parseInt(limit || '20', 10));
  }

  @UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
  @Post('catalog/services')
  @HttpCode(201)
  async createCatalog(@Body() dto: CreateCatalogDto) {
    return this.adminService.createCatalogEntry(dto as any);
  }

  @UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
  @Patch('catalog/services/:id')
  async updateCatalog(@Param('id') id: string, @Body() dto: Partial<CreateCatalogDto>) {
    return this.adminService.updateCatalogEntry(id, dto as any);
  }

  @UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
  @Delete('catalog/services/:id')
  async deleteCatalog(@Param('id') id: string) {
    return this.adminService.deleteCatalogEntry(id);
  }

  @UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
  @Get('complaints')
  async listComplaints(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.adminService.listComplaints(
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
      status,
      category,
    );
  }

  @UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
  @Patch('complaints/:id/status')
  async updateComplaintStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.adminService.updateComplaintStatus(id, dto.status, dto.note);
  }
}
