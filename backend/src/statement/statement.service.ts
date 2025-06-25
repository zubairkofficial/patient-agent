import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Statement } from '../model/statement.model';
import { CreateStatementDto } from './dto/statement.dto';
import { UpdateStatementDto } from './dto/statement.dto';
import { joinstatementemotions } from 'src/model/Jointablestatementemotion.model';
import { Emotions } from 'src/model/emotions.model';
import { Response } from 'src/model/response.model';
import { Section } from 'src/model/section.model';
import { Skills } from 'src/model/skills.model';

@Injectable()
export class StatementService {
  constructor(
    @InjectModel(Statement)
    private statementModel: typeof Statement,
  ) { }

  async create(dto: CreateStatementDto) {
    console.log('Creating statement with DTO:', dto);
    const statement = await this.statementModel.create({
      statement: dto.statement,
      sectionId: dto.sectionId,
    });

    if (dto.emotionIds && dto.emotionIds.length > 0) {
      for (const emotionId of dto.emotionIds) {
        console.log(`Inserting emotionId ${emotionId} for statementId ${statement.id}`);
        try {
          await joinstatementemotions.create({
            emotionId,
            statementId: statement.id,
            sectionId: dto.sectionId,
          });
        } catch (error) {
          console.log(
            `Failed to insert emotionId ${emotionId} for statementId ${statement.id}:`,
            error,
          );
          // Continue to the next emotionId
          continue;
        }
      }
    }
  }

  async findAll() {
    return this.statementModel.findAll({
      include: [
        {
          model: Emotions,
        },
        {
          model: Section
        }
      ],
    });
  }

  async findById(id: number) {
    const statement = await this.statementModel.findByPk(id, {
      include: [
        {
          model: Emotions,
        },
        {
          model: Section,
          include: [
            {
              model: Skills,
            }
          ]
        },

      ],
    });

    if (!statement) {
      throw new NotFoundException('Statement not found');
    }

    return statement;
  }

  async findBySectionId(sectionId: number) {
    return this.statementModel.findAll({
      where: { sectionId },
      include: [
        {
          model: Emotions,
        },
        {
          required: false,
          model: Response,
        },
        {
          model: Section,
          include: [
            {
              model: Skills,
            },
          ],
        },
      ],
    });
  }

  async update(id: number, dto: UpdateStatementDto) {
    const statement = await this.findById(id);
    return statement.update(dto);
  }

  async delete(id: number) {
    const statement = await this.findById(id);
    return statement.destroy();
  }
}
