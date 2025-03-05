import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Audio } from '../../domain/audio';

export abstract class AudioRepository {
  abstract create(
    data: Omit<Audio, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Audio>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Audio[]>;

  abstract findById(id: Audio['id']): Promise<NullableType<Audio>>;

  abstract findByIds(ids: Audio['id'][]): Promise<Audio[]>;

  abstract update(
    id: Audio['id'],
    payload: DeepPartial<Audio>,
  ): Promise<Audio | null>;

  abstract remove(id: Audio['id']): Promise<void>;
}
