import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintsService } from './complaints.service';
import { getModelToken } from '@nestjs/mongoose';
import { Complaint } from '../common/schemas/complaint.schema';
import { ComplaintStatusUpdate } from '../common/schemas/complaint-status-update.schema';
import { User } from '../common/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ComplaintsService', () => {
  let service: ComplaintsService;
  let mockComplaintModel: Record<string, any>;
  let mockStatusUpdateModel: Record<string, any>;
  let mockUserModel: Record<string, any>;
  let mockAuthService: Record<string, any>;

  beforeEach(async () => {
    mockComplaintModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    mockStatusUpdateModel = {
      find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }),
      create: jest.fn(),
    };
    mockUserModel = {
      findOne: jest.fn(),
    };
    mockAuthService = {
      verifyOtp: jest.fn().mockResolvedValue({ access_token: 't', refresh_token: 'r' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintsService,
        { provide: getModelToken(Complaint.name), useValue: mockComplaintModel },
        { provide: getModelToken(ComplaintStatusUpdate.name), useValue: mockStatusUpdateModel },
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<ComplaintsService>(ComplaintsService);
  });

  describe('getByTrackingId', () => {
    it('should throw NotFoundException for non-existent tracking ID', async () => {
      mockComplaintModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      await expect(service.getByTrackingId('SB-INVALID1')).rejects.toThrow(NotFoundException);
    });

    it('should return complaint with status history', async () => {
      const mockComplaint = {
        _id: 'c1',
        trackingId: 'SB-ABCD1234',
        category: 'road_infrastructure',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockComplaintModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(mockComplaint) });

      const mockHistory = [
        { status: 'submitted', createdAt: new Date(), note: 'Filed by citizen' },
      ];
      mockStatusUpdateModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockHistory) }),
      });

      const result = await service.getByTrackingId('SB-ABCD1234');

      expect(result.trackingId).toBe('SB-ABCD1234');
      expect(result.category).toBe('road_infrastructure');
      expect(result.statusHistory).toHaveLength(1);
    });
  });

  describe('fileComplaint — tracking ID generation', () => {
    it('should generate a tracking ID with SB- prefix', async () => {
      const mockUser = { _id: 'u1', phone: '9876543210' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // No duplicate found
      mockComplaintModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      // First findOne call is for tracking ID collision check (returns null = no collision)
      // Second findOne call is for duplicate detection (returns null = no duplicate)
      mockComplaintModel.findOne
        .mockResolvedValueOnce(null) // tracking ID collision check
        .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue(null) }); // duplicate detection

      const mockCreated = {
        _id: 'comp1',
        trackingId: 'SB-TEST1234',
        status: 'submitted',
      };
      mockComplaintModel.create.mockResolvedValue(mockCreated);
      mockStatusUpdateModel.create.mockResolvedValue({});

      const result = await service.fileComplaint({
        category: 'road_infrastructure',
        description: 'Pothole on main road',
        lat: 28.6,
        lng: 77.2,
        photoUrls: [],
        phone: '9876543210',
        otp: '1234',
      });

      expect(result.trackingId).toMatch(/^SB-/);
      expect(result.status).toBe('submitted');
      expect(mockAuthService.verifyOtp).toHaveBeenCalledWith('9876543210', '1234');
    });

    it('should set confidenceFlag to low when no photos', async () => {
      mockUserModel.findOne.mockResolvedValue({ _id: 'u1', phone: '9876543210' });
      mockComplaintModel.findOne
        .mockResolvedValueOnce(null)
        .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue(null) });

      mockComplaintModel.create.mockImplementation((data: any) => {
        expect(data.confidenceFlag).toBe('low');
        return Promise.resolve({ _id: 'c1', trackingId: data.trackingId, status: 'submitted' });
      });
      mockStatusUpdateModel.create.mockResolvedValue({});

      await service.fileComplaint({
        category: 'water_supply',
        description: 'No water',
        lat: 28.6,
        lng: 77.2,
        photoUrls: [],
        phone: '9876543210',
        otp: '1234',
      });
    });

    it('should set confidenceFlag to high when photos provided', async () => {
      mockUserModel.findOne.mockResolvedValue({ _id: 'u1', phone: '9876543210' });
      mockComplaintModel.findOne
        .mockResolvedValueOnce(null)
        .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue(null) });

      mockComplaintModel.create.mockImplementation((data: any) => {
        expect(data.confidenceFlag).toBe('high');
        return Promise.resolve({ _id: 'c1', trackingId: data.trackingId, status: 'submitted' });
      });
      mockStatusUpdateModel.create.mockResolvedValue({});

      await service.fileComplaint({
        category: 'water_supply',
        description: 'Pipe burst',
        lat: 28.6,
        lng: 77.2,
        photoUrls: ['https://r2.example.com/photo1.jpg'],
        phone: '9876543210',
        otp: '1234',
      });
    });
  });
});
