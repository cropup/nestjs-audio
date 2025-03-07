import { Module } from '@nestjs/common';
import { AnalysisRepository } from '../analysis.repository';
import { AnalysisRelationalRepository } from './repositories/analysis.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisEntity } from './entities/analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalysisEntity])],
  providers: [
    {
      provide: AnalysisRepository,
      useClass: AnalysisRelationalRepository,
    },
  ],
  exports: [AnalysisRepository],
})
export class RelationalAnalysisPersistenceModule {}
