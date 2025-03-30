import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { AnalysisEntity } from '../entities/analysis.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Analysis } from '../../../../domain/analysis';
import { AnalysisRepository } from '../../analysis.repository';
import { AnalysisMapper } from '../mappers/analysis.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AnalysisRelationalRepository implements AnalysisRepository {
  constructor(
    @InjectRepository(AnalysisEntity)
    private readonly analysisRepository: Repository<AnalysisEntity>,
  ) {}

  async create(data: Analysis): Promise<Analysis> {
    const persistenceModel = AnalysisMapper.toPersistence(data);
    const newEntity = await this.analysisRepository.save(
      this.analysisRepository.create(persistenceModel),
    );
    return AnalysisMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Analysis[]> {
    const entities = await this.analysisRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AnalysisMapper.toDomain(entity));
  }

  async findAllHours(): Promise<{ hour: string; count: number }[]> {
    const all = await this.analysisRepository.find();
    console.log(all[0].createdAt);
    const result = await this.analysisRepository.query(`
      SELECT 
        DATE_TRUNC('hour', "createdAt") as hour,
        COUNT(*) as count
      FROM analysis
      GROUP BY DATE_TRUNC('hour', "createdAt")
      ORDER BY DATE_TRUNC('hour', "createdAt") DESC
    `);

    console.log(result);

    return result;
  }

  async findAllByHour(hour: string): Promise<Analysis[]> {
    const from = new Date(hour);
    const to = new Date(hour);
    to.setHours(to.getHours() + 1);

    const entities = await this.analysisRepository.find({
      where: {
        createdAt: Between(from, to),
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return entities.map((entity) => AnalysisMapper.toDomain(entity));
  }

  async findById(id: Analysis['id']): Promise<NullableType<Analysis>> {
    const entity = await this.analysisRepository.findOne({
      where: { id },
    });

    return entity ? AnalysisMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Analysis['id'][]): Promise<Analysis[]> {
    const entities = await this.analysisRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AnalysisMapper.toDomain(entity));
  }

  async update(
    id: Analysis['id'],
    payload: Partial<Analysis>,
  ): Promise<Analysis> {
    const entity = await this.analysisRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.analysisRepository.save(
      this.analysisRepository.create(
        AnalysisMapper.toPersistence({
          ...AnalysisMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AnalysisMapper.toDomain(updatedEntity);
  }

  async remove(id: Analysis['id']): Promise<void> {
    await this.analysisRepository.delete(id);
  }
}
