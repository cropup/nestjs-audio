import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { AnalysisErrorType } from '../domain/analysis-error';

export class AnalysisErrorDto {
  @ApiProperty({
    enum: ['grammar', 'vocabulary', 'pronunciation'],
    description: 'The type of error identified in the analysis',
  })
  @IsEnum(['grammar', 'vocabulary', 'pronunciation'] as const)
  type: AnalysisErrorType;

  @ApiProperty({
    description: 'The original sentence or phrase from the student',
  })
  @IsString()
  original: string;

  @ApiProperty({
    description: 'The corrected sentence or phrase',
  })
  @IsString()
  correction: string;

  @ApiProperty({
    description: 'The explanation of the issue',
  })
  @IsString()
  explanation: string;
}
