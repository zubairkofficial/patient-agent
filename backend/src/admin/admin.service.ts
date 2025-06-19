import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdminProfile } from '../model/admin-profile.model';

@Injectable()
export class AdminProfileService {
  constructor(
    @InjectModel(AdminProfile)
    private readonly adminProfileModel: typeof AdminProfile,
  ) {}

  async getKey(): Promise<AdminProfile> {
    const existing = await this.adminProfileModel.findOne();
    if (!existing) {
      throw new NotFoundException('OpenAI key not found');
    }
    return existing;
  }

  async upsertKey(openaikey: string): Promise<AdminProfile> {
    const existing = await this.adminProfileModel.findOne();

    if (existing) {
      existing.openaikey = openaikey;
      await existing.save();
      return existing;
    }

    return this.adminProfileModel.create({ openaikey });
  }
}
