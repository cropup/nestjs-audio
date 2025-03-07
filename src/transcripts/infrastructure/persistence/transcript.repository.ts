import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Transcript } from '../../domain/transcript';

export abstract class TranscriptRepository {
  abstract create(
    data: Omit<Transcript, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transcript>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Transcript[]>;

  abstract findById(id: Transcript['id']): Promise<NullableType<Transcript>>;

  abstract findByIds(ids: Transcript['id'][]): Promise<Transcript[]>;

  abstract update(
    id: Transcript['id'],
    payload: DeepPartial<Transcript>,
  ): Promise<Transcript | null>;

  abstract remove(id: Transcript['id']): Promise<void>;
}
