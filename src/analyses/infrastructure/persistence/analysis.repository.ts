import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Analysis } from '../../domain/analysis';

export abstract class AnalysisRepository {
  abstract create(
    data: Omit<Analysis, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Analysis>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Analysis[]>;

  abstract findById(id: Analysis['id']): Promise<NullableType<Analysis>>;

  abstract findByIds(ids: Analysis['id'][]): Promise<Analysis[]>;

  abstract update(
    id: Analysis['id'],
    payload: DeepPartial<Analysis>,
  ): Promise<Analysis | null>;

  abstract remove(id: Analysis['id']): Promise<void>;
}
