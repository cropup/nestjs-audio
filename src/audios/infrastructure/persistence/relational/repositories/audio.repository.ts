import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AudioEntity } from '../entities/audio.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Audio } from '../../../../domain/audio';
import { AudioRepository } from '../../audio.repository';
import { AudioMapper } from '../mappers/audio.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AudioRelationalRepository implements AudioRepository {
  constructor(
    @InjectRepository(AudioEntity)
    private readonly audioRepository: Repository<AudioEntity>,
  ) {}

  async create(data: Audio): Promise<Audio> {
    const persistenceModel = AudioMapper.toPersistence(data);
    const newEntity = await this.audioRepository.save(
      this.audioRepository.create(persistenceModel),
    );
    return AudioMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Audio[]> {
    const entities = await this.audioRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AudioMapper.toDomain(entity));
  }

  async findById(id: Audio['id']): Promise<NullableType<Audio>> {
    const entity = await this.audioRepository.findOne({
      where: { id },
    });

    return entity ? AudioMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Audio['id'][]): Promise<Audio[]> {
    const entities = await this.audioRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AudioMapper.toDomain(entity));
  }

  async update(id: Audio['id'], payload: Partial<Audio>): Promise<Audio> {
    const entity = await this.audioRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.audioRepository.save(
      this.audioRepository.create(
        AudioMapper.toPersistence({
          ...AudioMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AudioMapper.toDomain(updatedEntity);
  }

  async remove(id: Audio['id']): Promise<void> {
    await this.audioRepository.delete(id);
  }
}
