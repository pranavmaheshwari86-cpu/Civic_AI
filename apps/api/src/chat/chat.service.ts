import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import { Conversation, ConversationDocument } from '../common/schemas/conversation.schema';
import { Message, MessageDocument } from '../common/schemas/message.schema';
import { ServiceCatalog, ServiceCatalogDocument } from '../common/schemas/catalog.schema';
import { Redis } from 'ioredis';

@Injectable()
export class ChatService {
  private anthropic: Anthropic;
  private isMock: boolean;
  private circuitBreaker = { failures: 0, lastTripTime: 0 };
  private readonly FAILURE_THRESHOLD = 5;
  private readonly COOLDOWN_MS = 60000;

  constructor(
    private configService: ConfigService,
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(ServiceCatalog.name) private catalogModel: Model<ServiceCatalogDocument>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY') || '';
    this.isMock = !apiKey || apiKey === 'mock-key';
    this.anthropic = new Anthropic({ apiKey: apiKey || 'sk-placeholder' });
  }

  async getOrCreateConversation(conversationId: string | null, userId?: string, sessionId?: string): Promise<ConversationDocument> {
    if (conversationId) {
      const existing = await this.conversationModel.findById(conversationId);
      if (existing) return existing;
    }
    return this.conversationModel.create({
      userId: userId ? new Types.ObjectId(userId) : null,
      anonymousSessionId: sessionId || null,
      language: 'en',
    });
  }

  async classifyIntent(message: string): Promise<{ category: string; detectedLanguage: string }> {
    if (this.isCircuitTripped() || this.isMock) {
      return { category: 'general', detectedLanguage: 'en' };
    }
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        system: 'Classify the user message intent. Return ONLY valid JSON: {"category":"document_info"|"complaint"|"scheme_lookup"|"general"|"unknown","detectedLanguage":"en"|"hi"}',
        messages: [{ role: 'user', content: message }],
      });
      const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
      this.resetCircuit();
      const parsed = JSON.parse(text);
      return { category: parsed.category || 'general', detectedLanguage: parsed.detectedLanguage || 'en' };
    } catch {
      this.recordFailure();
      return { category: 'general', detectedLanguage: 'en' };
    }
  }

  async getContextMessages(conversationId: Types.ObjectId): Promise<Array<{ role: string; content: string }>> {
    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    return messages.reverse().map((m) => ({ role: m.role, content: m.content }));
  }

  async generateResponse(
    conversationId: string,
    userMessage: string,
    intent: { category: string; detectedLanguage: string },
    contextMessages: Array<{ role: string; content: string }>,
  ): Promise<{ content: string; confidenceScore: number; catalogIds: string[] }> {
    if (this.isMock) {
      return {
        content: `Thank you for your query about "${userMessage}". As an AI civic companion, I can help you with government services, scheme eligibility, and civic complaints. How can I assist you further?`,
        confidenceScore: 0.85,
        catalogIds: [],
      };
    }

    const systemPrompt = this.buildSystemPrompt(intent);
    const messages = [
      ...contextMessages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: userMessage },
    ];

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      });
      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      this.resetCircuit();
      return { content: text, confidenceScore: 0.9, catalogIds: [] };
    } catch {
      this.recordFailure();
      throw new InternalServerErrorException('AI service unavailable');
    }
  }

  async saveMessage(conversationId: Types.ObjectId, role: string, content: string, intent?: string, confidence?: number, catalogIds?: Types.ObjectId[]) {
    return this.messageModel.create({
      conversationId,
      role,
      content,
      intentCategory: intent || null,
      confidenceScore: confidence || null,
      retrievedCatalogIds: catalogIds || [],
    });
  }

  async getFallbackResponse(): Promise<{ content: string; services: Array<{ serviceName: string; department: string }> }> {
    const cached = await this.redis.get('fallback:top5');
    let services: Array<{ serviceName: string; department: string }> = [];
    if (cached) {
      services = JSON.parse(cached);
    } else {
      const docs = await this.catalogModel.find({ isActive: true }).limit(5).lean();
      services = docs.map((d) => ({ serviceName: d.serviceName, department: d.department }));
      await this.redis.set('fallback:top5', JSON.stringify(services), 'EX', 86400);
    }
    return {
      content: "I'm temporarily unable to process your request. Here are some popular services you can explore, or you can file a complaint directly.",
      services,
    };
  }

  private buildSystemPrompt(intent: { category: string; detectedLanguage: string }): string {
    const lang = intent.detectedLanguage === 'hi' ? 'Hindi' : 'English';
    return `You are Smart Bharat, an AI-powered civic companion for Indian citizens. Respond in ${lang}.
Rules:
- Never fabricate government facts, fees, deadlines, or form numbers not in your context.
- If you don't know, say so clearly and suggest visiting the official portal.
- Never ask for Aadhaar, PAN, or sensitive ID numbers.
- Keep responses concise and actionable.
- Use bullet points for document checklists.
- For complaints, guide the user through the filing process step by step.`;
  }

  private isCircuitTripped(): boolean {
    if (this.circuitBreaker.failures >= this.FAILURE_THRESHOLD) {
      if (Date.now() - this.circuitBreaker.lastTripTime < this.COOLDOWN_MS) return true;
      this.circuitBreaker.failures = 0;
    }
    return false;
  }

  private recordFailure() {
    this.circuitBreaker.failures++;
    if (this.circuitBreaker.failures >= this.FAILURE_THRESHOLD) {
      this.circuitBreaker.lastTripTime = Date.now();
    }
  }

  private resetCircuit() {
    this.circuitBreaker.failures = 0;
  }
}
