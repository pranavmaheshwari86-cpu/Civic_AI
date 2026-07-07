import { Controller, Post, Get, Body, Param, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IsString, IsOptional } from 'class-validator';
import { Response } from 'express';
import { Types } from 'mongoose';

class SendMessageDto {
  @IsString()
  @IsOptional()
  conversationId: string | null;

  @IsString()
  message: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @HttpCode(200)
  async sendMessage(@Body() dto: SendMessageDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const conversation = await this.chatService.getOrCreateConversation(dto.conversationId);

      // Save user message
      await this.chatService.saveMessage(conversation._id as Types.ObjectId, 'user', dto.message);

      // Classify intent
      const intent = await this.chatService.classifyIntent(dto.message);
      const contextMessages = await this.chatService.getContextMessages(conversation._id as Types.ObjectId);

      // Generate response
      const result = await this.chatService.generateResponse(
        (conversation._id as Types.ObjectId).toHexString(),
        dto.message,
        intent,
        contextMessages,
      );

      // Stream tokens as SSE
      const words = result.content.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ type: 'token', data: word + ' ' })}\n\n`);
      }

      // Save assistant message
      const assistantMsg = await this.chatService.saveMessage(
        conversation._id as Types.ObjectId,
        'assistant',
        result.content,
        intent.category,
        result.confidenceScore,
      );

      // Send done event
      res.write(`data: ${JSON.stringify({ type: 'done', data: { messageId: (assistantMsg._id as Types.ObjectId).toHexString(), confidenceScore: result.confidenceScore, conversationId: (conversation._id as Types.ObjectId).toHexString() } })}\n\n`);
      res.end();
    } catch {
      // Circuit breaker fallback
      const fallback = await this.chatService.getFallbackResponse();
      res.write(`data: ${JSON.stringify({ type: 'token', data: fallback.content })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'done', data: { messageId: null, confidenceScore: 0 } })}\n\n`);
      res.end();
    }
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    const conversation = await this.chatService.getOrCreateConversation(id);
    const messages = await this.chatService.getContextMessages(conversation._id as Types.ObjectId);
    return { id: (conversation._id as Types.ObjectId).toHexString(), messages, language: conversation.language, createdAt: (conversation as any).createdAt };
  }
}
