import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { EmbeddingService } from './embedding.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ServiceCatalog, ServiceCatalogSchema } from '../common/schemas/catalog.schema';
import { SchemeCatalog, SchemeCatalogSchema } from '../common/schemas/scheme.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCatalog.name, schema: ServiceCatalogSchema },
      { name: SchemeCatalog.name, schema: SchemeCatalogSchema },
    ]),
    BullModule.registerQueue({
      name: 'catalog-embeddings',
    }),
  ],
  controllers: [CatalogController],
  providers: [CatalogService, EmbeddingService],
  exports: [CatalogService, EmbeddingService],
})
export class CatalogModule {}
