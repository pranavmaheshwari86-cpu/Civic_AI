import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { IsString, IsIn, IsOptional } from 'class-validator';

class SubmitFeedbackDto {
  @IsString()
  messageId: string;

  @IsIn(['up', 'down'])
  rating: 'up' | 'down';

  @IsString()
  @IsOptional()
  comment?: string;
}

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(201)
  async submitFeedback(@Body() dto: SubmitFeedbackDto) {
    return this.feedbackService.submitFeedback(dto.messageId, dto.rating, dto.comment);
  }
}
