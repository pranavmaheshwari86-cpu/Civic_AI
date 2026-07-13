import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('process')
  @HttpCode(200)
  async processDocument(@Body() body: { fileUrl: string }) {
    return this.documentService.processDocument(body.fileUrl);
  }
}
