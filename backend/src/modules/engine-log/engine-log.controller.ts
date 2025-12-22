import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EngineLogService } from './engine-log.service';
import { CreateEngineLogDto } from './dto/create-engine-log.dto';
import { UpdateEngineLogDto } from './dto/update-engine-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Engine Log')
@Controller('engine-log')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EngineLogController {
  constructor(private readonly engineLogService: EngineLogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new engine log entry' })
  create(@Body() createDto: CreateEngineLogDto, @CurrentUser() user: any) {
    if (!createDto.engineerId) {
      createDto.engineerId = user.id;
    }
    return this.engineLogService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all engine log entries' })
  findAll(
    @Query('vesselId') vesselId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @CurrentUser() user?: any,
  ) {
    const finalVesselId =
      user?.role === UserRole.SYSTEM_ADMIN || user?.role === UserRole.DPA_OFFICE
        ? vesselId
        : user?.vesselId || vesselId;
    return this.engineLogService.findAll(finalVesselId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get engine log entry by ID' })
  findOne(@Param('id') id: string) {
    return this.engineLogService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update engine log entry' })
  update(@Param('id') id: string, @Body() updateDto: UpdateEngineLogDto) {
    return this.engineLogService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete engine log entry' })
  remove(@Param('id') id: string) {
    return this.engineLogService.remove(id);
  }
}

