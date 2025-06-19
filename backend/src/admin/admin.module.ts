import { Module } from '@nestjs/common';
import { AdminProfileService } from './admin.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminProfileController } from './admin.controller';
import { AdminProfile } from 'src/model/admin-profile.model';

@Module({
  providers: [AdminProfileService],
    imports: [SequelizeModule.forFeature([AdminProfile])],
  controllers: [AdminProfileController],
})
export class AdminModule {}
