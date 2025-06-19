import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Statement } from '../model/statement.model';
import { CreateStatementDto } from './dto/statement.dto';
import { UpdateStatementDto } from './dto/statement.dto';

@Injectable()
export class StatementService {
  constructor(
    @InjectModel(Statement)
    private statementModel: typeof Statement,
  ) {}

  async create(dto: CreateStatementDto) {
    return this.statementModel.create({ 
      statement: dto.statement,
      sectionId: dto.sectionId
     });
  }

  async findAll() {
    return this.statementModel.findAll();
  }

  async findById(id: number) {
    const statement = await this.statementModel.findByPk(id);
    if (!statement) throw new NotFoundException('Statement not found');
    return statement;
  }

  async findBySectionId(sectionId: number) {
    return this.statementModel.findAll({ where: { sectionId } });
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
