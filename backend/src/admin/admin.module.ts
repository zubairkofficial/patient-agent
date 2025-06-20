import { Module } from '@nestjs/common';
import { AdminProfileService } from './admin.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminProfileController } from './admin.controller';
import { AdminProfile } from 'src/model/admin-profile.model';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  providers: [AdminProfileService],
    imports: [SequelizeModule.forFeature([AdminProfile]), JwtAuthGuard],
  controllers: [AdminProfileController],
})
export class AdminModule {}
