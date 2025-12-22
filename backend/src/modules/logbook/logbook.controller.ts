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
import { LogbookService } from './logbook.service';
import { CreateLogbookEntryDto } from './dto/create-logbook-entry.dto';
import { UpdateLogbookEntryDto } from './dto/update-logbook-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Logbook')
@Controller('logbook')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new logbook entry' })
  create(@Body() createDto: CreateLogbookEntryDto, @CurrentUser() user: any) {
    if (!createDto.officerId) {
      createDto.officerId = user.id;
    }
    return this.logbookService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all logbook entries' })
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
    return this.logbookService.findAll(finalVesselId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get logbook entry by ID' })
  findOne(@Param('id') id: string) {
    return this.logbookService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update logbook entry' })
  update(@Param('id') id: string, @Body() updateDto: UpdateLogbookEntryDto) {
    return this.logbookService.update(id, updateDto);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign logbook entry (Captain only)' })
  sign(@Param('id') id: string, @CurrentUser() user: any) {
    return this.logbookService.sign(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete logbook entry' })
  remove(@Param('id') id: string) {
    return this.logbookService.remove(id);
  }
}

