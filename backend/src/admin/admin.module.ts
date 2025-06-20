import { Module } from '@nestjs/common';
import { AdminProfileService } from './admin.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminProfileController } from './admin.controller';
import { AdminProfile } from 'src/model/admin-profile.model';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AdminProfileService, JwtService, JwtAuthGuard],
    imports: [SequelizeModule.forFeature([AdminProfile])],
  controllers: [AdminProfileController],
})
export class AdminModule {}
