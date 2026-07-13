import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceCatalog, ServiceCatalogDocument } from '../common/schemas/catalog.schema';
import { SchemeCatalog, SchemeCatalogDocument } from '../common/schemas/scheme.schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(ServiceCatalog.name) private serviceCatalogModel: Model<ServiceCatalogDocument>,
    @InjectModel(SchemeCatalog.name) private schemeCatalogModel: Model<SchemeCatalogDocument>,
    @InjectQueue('catalog-embeddings') private embeddingsQueue: Queue,
  ) {}

  async searchServices(query: string, lang: string = 'en') {
    // Text search fallback (Atlas Vector Search requires Atlas deployment)
    const regex = new RegExp(query, 'i');
    const descField = lang === 'hi' ? 'description.hi' : 'description.en';
    
    const results = await this.serviceCatalogModel
      .find({
        isActive: true,
        $or: [
          { serviceName: regex },
          { [descField]: regex },
          { category: regex },
        ],
      })
      .limit(10)
      .lean();

    return {
      services: results.map((r) => ({
        serviceId: r._id,
        serviceName: r.serviceName,
        description: lang === 'hi' ? r.description.hi : r.description.en,
        category: r.category,
        department: r.department,
        officialPortalUrl: r.officialPortalUrl,
        requiredDocuments: r.requiredDocuments.map((d) => ({
          label: lang === 'hi' ? d.label.hi : d.label.en,
          conditionalOn: d.conditionalOn,
        })),
      })),
    };
  }

  async matchSchemes(profile: { ageRange?: string; occupationType?: string; state?: string; gender?: string }) {
    const filter: Record<string, any> = { isActive: true };

    if (profile.state) {
      filter.$or = [
        { 'eligibilityCriteria.applicableStates': profile.state },
        { 'eligibilityCriteria.applicableStates': { $size: 0 } }, // national schemes
      ];
    }

    if (profile.gender) {
      filter.$or = [
        ...(filter.$or || []),
        { 'eligibilityCriteria.genderRestriction': null },
        { 'eligibilityCriteria.genderRestriction': profile.gender },
      ];
    }

    const schemes = await this.schemeCatalogModel.find(filter).limit(20).lean();

    // Client-side age filtering
    let results = schemes;
    if (profile.ageRange) {
      const [minStr, maxStr] = profile.ageRange.split('-');
      const userAge = parseInt(minStr, 10);
      results = schemes.filter((s) => {
        const criteria = s.eligibilityCriteria;
        if (criteria.ageMin && userAge < criteria.ageMin) return false;
        if (criteria.ageMax && userAge > criteria.ageMax) return false;
        return true;
      });
    }

    return {
      matches: results.map((s) => ({
        schemeId: s._id,
        schemeName: s.schemeName,
        description: s.description.en,
        applicationUrl: s.applicationUrl,
        department: s.department,
        benefits: s.benefitsDescription.en,
      })),
    };
  }

  async createService(data: any) {
    const service = await this.serviceCatalogModel.create(data);
    await this.embeddingsQueue.add('re-embed', {
      type: 'service',
      id: service._id,
      text: `${service.serviceName} ${service.description.en} ${service.category}`,
    });
    return service;
  }

  async updateService(id: string, data: any) {
    const service = await this.serviceCatalogModel.findByIdAndUpdate(id, data, { new: true });
    if (service) {
      await this.embeddingsQueue.add('re-embed', {
        type: 'service',
        id: service._id,
        text: `${service.serviceName} ${service.description.en} ${service.category}`,
      });
    }
    return service;
  }
}
