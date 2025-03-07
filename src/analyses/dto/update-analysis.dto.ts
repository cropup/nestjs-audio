// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAnalysisDto } from './create-analysis.dto';

export class UpdateAnalysisDto extends PartialType(CreateAnalysisDto) {}
