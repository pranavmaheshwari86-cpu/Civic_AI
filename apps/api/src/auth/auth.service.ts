import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async requestOtp(phone: string): Promise<void> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hash = await bcrypt.hash(otp, 12);
    
    await this.redis.set(`otp:${phone}`, hash, 'EX', 300);

    // Call MSG91 API
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;
    
    if (msg91AuthKey && msg91TemplateId) {
      const response = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=91${phone}&otp=${otp}`, {
        method: 'POST',
        headers: {
          'authkey': msg91AuthKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Failed to send OTP via MSG91', await response.text());
        // Fallback for development if SMS fails
      }
    } else {
      console.log(`[DEV MODE] OTP for ${phone} is ${otp}`);
    }
  }

  async verifyOtp(phone: string, otp: string): Promise<{ access_token: string; refresh_token: string }> {
    const hash = await this.redis.get(`otp:${phone}`);
    if (!hash) {
      throw new BadRequestException('OTP expired or invalid');
    }

    const isValid = await bcrypt.compare(otp, hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.redis.del(`otp:${phone}`); // Single use

    let user = await this.userModel.findOne({ phone });
    if (!user) {
      user = new this.userModel({ phone });
      await user.save();
    }

    const payload = { phone: user.phone, sub: (user._id as Types.ObjectId).toHexString() };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });

    return { access_token, refresh_token };
  }
}
