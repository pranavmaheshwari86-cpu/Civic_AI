import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AdminUser, AdminUserDocument } from '../common/schemas/admin-user.schema';
import { ServiceCatalog, ServiceCatalogDocument } from '../common/schemas/catalog.schema';
import { Complaint, ComplaintDocument } from '../common/schemas/complaint.schema';
import { ComplaintStatusUpdate, ComplaintStatusUpdateDocument } from '../common/schemas/complaint-status-update.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminUser.name) private adminModel: Model<AdminUserDocument>,
    @InjectModel(ServiceCatalog.name) private catalogModel: Model<ServiceCatalogDocument>,
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
    @InjectModel(ComplaintStatusUpdate.name) private statusUpdateModel: Model<ComplaintStatusUpdateDocument>,
    @InjectQueue('catalog-embeddings') private embeddingQueue: Queue,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.adminModel.findOne({ email });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: (admin._id as Types.ObjectId).toHexString(), email: admin.email, role: admin.role });
    return { accessToken: token };
  }

  async seedAdmin(email: string, password: string, role: string = 'admin') {
    const exists = await this.adminModel.findOne({ email });
    if (exists) return exists;
    const hash = await bcrypt.hash(password, 12);
    return this.adminModel.create({ email, passwordHash: hash, role });
  }

  // Catalog CRUD
  async listCatalog(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.catalogModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.catalogModel.countDocuments(),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async createCatalogEntry(data: Partial<ServiceCatalogDocument>) {
    const entry = await this.catalogModel.create({
      ...data,
      lastReviewedAt: new Date(),
      isActive: true,
    });
    // Dispatch re-embedding job
    const entryId = (entry._id as Types.ObjectId).toHexString();
    const text = `${(entry as any).name || ''} ${(entry as any).department || ''} ${(entry as any).description || ''}`;
    await this.embeddingQueue.add('embed', { id: entryId, text: text.trim() }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
    return entry;
  }

  async updateCatalogEntry(id: string, data: Partial<ServiceCatalogDocument>) {
    const entry = await this.catalogModel.findByIdAndUpdate(
      id,
      { ...data, lastReviewedAt: new Date() },
      { new: true },
    );
    if (!entry) throw new NotFoundException('Catalog entry not found');
    // Dispatch re-embedding job
    const text = `${(entry as any).name || ''} ${(entry as any).department || ''} ${(entry as any).description || ''}`;
    await this.embeddingQueue.add('embed', { id, text: text.trim() }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
    return entry;
  }

  async deleteCatalogEntry(id: string) {
    const entry = await this.catalogModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!entry) throw new NotFoundException('Catalog entry not found');
    return { deleted: true };
  }

  // Complaint management
  async listComplaints(page: number = 1, limit: number = 20, status?: string, category?: string) {
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.complaintModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.complaintModel.countDocuments(filter),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateComplaintStatus(complaintId: string, status: string, note?: string, adminId?: string) {
    const complaint = await this.complaintModel.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true },
    );
    if (!complaint) throw new NotFoundException('Complaint not found');

    await this.statusUpdateModel.create({
      complaintId: complaint._id,
      status,
      note: note || null,
      updatedBy: adminId || 'admin',
    });

    return complaint;
  }
}
