import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from '../common/schemas/conversation.schema';
import { Message, MessageSchema } from '../common/schemas/message.schema';
import { ServiceCatalog, ServiceCatalogSchema } from '../common/schemas/catalog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: ServiceCatalog.name, schema: ServiceCatalogSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
