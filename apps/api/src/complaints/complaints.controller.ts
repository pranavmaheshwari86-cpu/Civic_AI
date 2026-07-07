import { Controller, Post, Get, Body, Param, HttpCode, UseGuards, BadRequestException } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsNumber, IsOptional, IsIn, IsArray } from 'class-validator';

class FileComplaintDto {
  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @IsString()
  phone: string;

  @IsString()
  otp: string;
}

class GetUploadUrlDto {
  @IsString()
  contentType: string;

  @IsString()
  filename: string;
}

@Controller('complaints')
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(201)
  async fileComplaint(@Body() dto: FileComplaintDto) {
    return this.complaintsService.fileComplaint({
      category: dto.category,
      description: dto.description,
      lat: dto.lat,
      lng: dto.lng,
      landmark: dto.landmark,
      photoUrls: dto.photoUrls || [],
      phone: dto.phone,
      otp: dto.otp,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-url')
  async getUploadUrl(@Body() dto: GetUploadUrlDto) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(dto.contentType)) {
      throw new BadRequestException('Unsupported file type');
    }
    return this.uploadService.getPresignedUploadUrl(dto.contentType, dto.filename);
  }

  @Get(':id')
  async getComplaint(@Param('id') id: string) {
    return this.complaintsService.getByTrackingId(id);
  }
}
