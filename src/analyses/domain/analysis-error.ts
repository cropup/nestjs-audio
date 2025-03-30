import { ApiProperty } from '@nestjs/swagger';

export type AnalysisErrorType = 'grammar' | 'vocabulary' | 'pronunciation';

export class AnalysisError {
  @ApiProperty({
    enum: ['grammar', 'vocabulary', 'pronunciation'],
    description: 'The type of error identified in the analysis',
  })
  type: AnalysisErrorType;

  // @ApiProperty({
  //   description: 'Description of the issue identified',
  // })
  // issue?: string;

  // @ApiProperty({
  //   description: 'Feedback provided to address the issue',
  // })
  // feedback?: string;

  @ApiProperty({
    description: 'The original sentence or phrase from the student',
  })
  original: string;

  @ApiProperty({
    description: 'The corrected sentence or phrase',
  })
  correction: string;

  @ApiProperty({
    description: 'The explanation of the issue',
  })
  explanation: string;

  // @ApiPropertyOptional({
  //   description: 'The pronunciation provided by the student',
  // })
  // studentPronunciation?: string;

  // @ApiPropertyOptional({
  //   description: 'The correct pronunciation',
  // })
  // correctPronunciation?: string;
}
