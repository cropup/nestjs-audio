import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnalysesService } from './analyses.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Analysis } from './domain/analysis';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAnalysesDto } from './dto/find-all-analyses.dto';

@ApiTags('Analyses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'analyses',
  version: '1',
})
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Analysis,
  })
  create(@Body() createAnalysisDto: CreateAnalysisDto) {
    return this.analysesService.create(createAnalysisDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Analysis),
  })
  async findAll(
    @Query() query: FindAllAnalysesDto,
  ): Promise<InfinityPaginationResponseDto<Analysis>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.analysesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get('hours')
  // @ApiOkResponse({
  //   type: [
  //     {
  //       hour: String,
  //       count: Number,
  //     },
  //   ],
  // })
  findAllHours(): Promise<{ hour: string; count: number }[]> {
    return this.analysesService.findAllHours();
  }

  @Get('by-hour')
  @ApiOkResponse({
    type: [Analysis],
  })
  findAllByHour(@Query('hour') hour: string): Promise<Analysis[]> {
    return this.analysesService.findAllByHour(hour);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Analysis,
  })
  findById(@Param('id') id: string) {
    return this.analysesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Analysis,
  })
  update(
    @Param('id') id: string,
    @Body() updateAnalysisDto: UpdateAnalysisDto,
  ) {
    return this.analysesService.update(id, updateAnalysisDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.analysesService.remove(id);
  }
}
