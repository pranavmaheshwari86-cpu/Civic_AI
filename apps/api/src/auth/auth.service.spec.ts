import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../common/schemas/user.schema';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockRedis: Record<string, any>;
  let mockUserModel: Record<string, any>;
  let mockJwtService: Record<string, any>;

  beforeEach(async () => {
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockUserModel = {
      findOne: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('requestOtp', () => {
    it('should store a hashed OTP in Redis with 5 min TTL', async () => {
      mockRedis.set.mockResolvedValue('OK');

      await service.requestOtp('9876543210');

      expect(mockRedis.set).toHaveBeenCalledTimes(1);
      const [key, hash, mode, ttl] = mockRedis.set.mock.calls[0];
      expect(key).toBe('otp:9876543210');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(10); // bcrypt hash
      expect(mode).toBe('EX');
      expect(ttl).toBe(300);
    });
  });

  describe('verifyOtp', () => {
    it('should throw BadRequestException when OTP is expired (not in Redis)', async () => {
      mockRedis.get.mockResolvedValue(null);
      await expect(service.verifyOtp('9876543210', '1234')).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when OTP is wrong', async () => {
      const correctHash = await bcrypt.hash('5678', 12);
      mockRedis.get.mockResolvedValue(correctHash);
      await expect(service.verifyOtp('9876543210', '1234')).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens and delete OTP on valid verification', async () => {
      const otp = '4321';
      const hash = await bcrypt.hash(otp, 12);
      mockRedis.get.mockResolvedValue(hash);
      mockRedis.del.mockResolvedValue(1);

      const mockUser = { _id: { toHexString: () => 'user123' }, phone: '9876543210' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.verifyOtp('9876543210', otp);

      expect(mockRedis.del).toHaveBeenCalledWith('otp:9876543210');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should create a new user if phone not found', async () => {
      const otp = '1111';
      const hash = await bcrypt.hash(otp, 12);
      mockRedis.get.mockResolvedValue(hash);
      mockRedis.del.mockResolvedValue(1);

      // First call (findOne) returns null → creates new user
      mockUserModel.findOne.mockResolvedValue(null);

      // The service calls `new this.userModel({ phone })` then `.save()`
      // Since we mocked the model as a plain object, we need to handle
      // the constructor call. We'll use a function mock instead.
      const savedUser = { _id: { toHexString: () => 'newuser' }, phone: '9876543210', save: jest.fn() };

      // Reset with constructor-capable mock
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: JwtService, useValue: mockJwtService },
          {
            provide: getModelToken(User.name),
            useValue: Object.assign(
              jest.fn().mockImplementation(() => savedUser),
              { findOne: jest.fn().mockResolvedValue(null) },
            ),
          },
          { provide: 'REDIS_CLIENT', useValue: mockRedis },
        ],
      }).compile();

      const svc = module.get<AuthService>(AuthService);
      const result = await svc.verifyOtp('9876543210', otp);
      expect(result.access_token).toBe('mock-jwt-token');
    });
  });
});
