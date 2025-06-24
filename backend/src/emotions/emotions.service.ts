import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Emotions } from '../model/emotions.model';
import { CreateEmotionDto, UpdateEmotionDto } from './dto/emotion.dto';

@Injectable()
export class EmotionsService {
  constructor(
    @InjectModel(Emotions)
    private emotionModel: typeof Emotions,
  ) {}

  async create(dto: CreateEmotionDto): Promise<Emotions> {
    return this.emotionModel.create({ ...dto });
  }

  async findAll(): Promise<Emotions[]> {
    return this.emotionModel.findAll();
  }

  async findOne(id: number): Promise<Emotions> {
    const emotion = await this.emotionModel.findByPk(id);
    if (!emotion) throw new NotFoundException('Emotion not found');
    return emotion;
  }

  async update(id: number, dto: UpdateEmotionDto): Promise<Emotions> {
    const emotion = await this.findOne(id); 
    return emotion.update(dto);
  }

  // ✅ Delete Emotion by ID
  async remove(id: number): Promise<{ message: string }> {
    const emotion = await this.findOne(id);
    await emotion.destroy();
    return { message: 'Emotion deleted successfully' };
  }
}
