import { Controller, Get, Post, Body, Query, HttpCode } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { IsString, IsOptional } from 'class-validator';

class SchemeMatchDto {
  @IsString() @IsOptional() ageRange?: string;
  @IsString() @IsOptional() occupationType?: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsOptional() gender?: string;
}

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('services/search')
  async searchServices(@Query('q') query: string, @Query('lang') lang?: string) {
    return this.catalogService.searchServices(query || '', lang || 'en');
  }

  @Post('schemes/match')
  @HttpCode(200)
  async matchSchemes(@Body() dto: SchemeMatchDto) {
    return this.catalogService.matchSchemes(dto);
  }
}
