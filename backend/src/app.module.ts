import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LanggraphModule } from './langgraph/langgraph.module';
import { SectionModule } from './section/section.module';
import { SkillsModule } from './skills/skills.module';
import { StatementModule } from './statement/statement.module';
import { EmotionsModule } from './emotions/emotions.module';
import { ResponseModule } from './response/response.module';

// ✅ MODELS
import { User } from './model/user.model';
import { Doctor } from './model/doctorprofile.model';
import { Skills } from './model/skills.model';
import { Section } from './model/section.model';
import { JoinSectionSkills } from './model/JointableSectionSkill.model';
import { Statement } from './model/statement.model';
import { Emotions } from './model/emotions.model';
import { joinstatementemotions } from './model/Jointablestatementemotion.model';
import { Response } from './model/response.model';
import { AdminProfile } from './model/admin-profile.model';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'patient_agent',
      autoLoadModels: true,
      models: [
        User,
        Doctor,
        Skills,
        Section,
        JoinSectionSkills,
        Statement,
        Emotions,
        joinstatementemotions,
        Response,
        AdminProfile
      ],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: true,
      sync: {
        force: false,
        alter: process.env.NODE_ENV === 'development',
      },
      retryDelay: 3000,
    }),

    // ✅ Importing feature modules
    AuthModule,
    UserModule,
    LanggraphModule,
    SectionModule,
    SkillsModule,
    StatementModule, // 💡 This handles StatementController & StatementService
    EmotionsModule,
    ResponseModule,
    AdminModule,
  ],

  // ❌ REMOVE controllers managed by their own modules
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
