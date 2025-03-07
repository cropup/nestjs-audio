import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
