import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Complaint, ComplaintDocument } from '../common/schemas/complaint.schema';
import { ComplaintStatusUpdate, ComplaintStatusUpdateDocument } from '../common/schemas/complaint-status-update.schema';
import { User, UserDocument } from '../common/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { customAlphabet } from 'nanoid';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

@Injectable()
export class ComplaintsService {
  private readonly googleMaps = new GoogleMapsClient({});

  constructor(
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
    @InjectModel(ComplaintStatusUpdate.name) private statusUpdateModel: Model<ComplaintStatusUpdateDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async fileComplaint(data: {
    category: string;
    description: string;
    lat: number;
    lng: number;
    landmark?: string;
    photoUrls: string[];
    phone: string;
    otp: string;
  }) {
    // Verify OTP and get/create user
    const authResult = await this.authService.verifyOtp(data.phone, data.otp);
    const user = await this.userModel.findOne({ phone: data.phone });
    if (!user) throw new BadRequestException('User not found after OTP verification');

    let address = 'Unknown location';
    try {
      if (process.env.GOOGLE_MAPS_API_KEY) {
        const geoRes = await this.googleMaps.reverseGeocode({
          params: {
            latlng: { lat: data.lat, lng: data.lng },
            key: process.env.GOOGLE_MAPS_API_KEY,
          },
        });
        if (geoRes.data.results?.length > 0) {
          address = geoRes.data.results[0].formatted_address;
        }
      }
    } catch (e) {
      console.error('Geocoding failed:', e);
    }

    // Generate collision-checked tracking ID
    let trackingId: string;
    let attempts = 0;
    do {
      trackingId = `SB-${nanoid()}`;
      const exists = await this.complaintModel.findOne({ trackingId });
      if (!exists) break;
      attempts++;
    } while (attempts < 3);

    if (attempts >= 3) throw new BadRequestException('Failed to generate unique tracking ID');

    // Duplicate detection: same category, within 100m, last 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const duplicate = await this.complaintModel.findOne({
      category: data.category,
      createdAt: { $gte: fourteenDaysAgo },
      geoLocation: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [data.lng, data.lat] },
          $maxDistance: 100,
        },
      },
    }).lean();

    const confidenceFlag = data.photoUrls.length > 0 ? 'high' : 'low';

    const complaint = await this.complaintModel.create({
      trackingId,
      userId: user._id,
      category: data.category,
      description: data.description,
      location: { lat: data.lat, lng: data.lng, address: address, landmark: data.landmark || null },
      geoLocation: { type: 'Point', coordinates: [data.lng, data.lat] },
      photoUrls: data.photoUrls,
      status: 'submitted',
      confidenceFlag,
      duplicateOfComplaintId: duplicate ? duplicate._id : undefined,
    });

    // Initial status entry
    await this.statusUpdateModel.create({
      complaintId: (complaint as any)._id,
      status: 'submitted',
      note: duplicate ? `Complaint linked to ${(duplicate as any).trackingId}` : 'Complaint filed by citizen',
      updatedBy: 'system',
    });

    return {
      trackingId: (complaint as any).trackingId,
      status: (complaint as any).status,
      possibleDuplicate: duplicate
        ? { trackingId: duplicate.trackingId, distanceMeters: 100 }
        : null,
    };
  }

  async getByTrackingId(trackingId: string) {
    const complaint = await this.complaintModel.findOne({ trackingId }).lean();
    if (!complaint) throw new NotFoundException('Complaint not found');

    const statusHistory = await this.statusUpdateModel
      .find({ complaintId: complaint._id })
      .sort({ createdAt: 1 })
      .lean();

    return {
      trackingId: complaint.trackingId,
      category: complaint.category,
      status: complaint.status,
      statusHistory: statusHistory.map((s) => ({
        status: s.status,
        timestamp: (s as any).createdAt,
        note: s.note,
      })),
      createdAt: (complaint as any).createdAt,
      updatedAt: (complaint as any).updatedAt,
    };
  }

  async lookupByPhone(phone: string, otp: string) {
    await this.authService.verifyOtp(phone, otp);
    const user = await this.userModel.findOne({ phone });
    if (!user) return { complaints: [] };

    const complaints = await this.complaintModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return {
      complaints: complaints.map((c) => ({
        trackingId: c.trackingId,
        category: c.category,
        status: c.status,
        createdAt: (c as any).createdAt,
      })),
    };
  }
}
