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
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Incidents')
@Controller('incidents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new incident report' })
  create(@Body() createDto: CreateIncidentDto, @CurrentUser() user: any) {
    return this.incidentService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incident reports' })
  findAll(
    @Query('vesselId') vesselId?: string,
    @CurrentUser() user?: any,
  ) {
    const finalVesselId =
      user?.role === UserRole.SYSTEM_ADMIN || user?.role === UserRole.DPA_OFFICE
        ? vesselId
        : user?.vesselId || vesselId;
    return this.incidentService.findAll(finalVesselId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident report by ID' })
  findOne(@Param('id') id: string) {
    return this.incidentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update incident report' })
  update(@Param('id') id: string, @Body() updateDto: UpdateIncidentDto, @CurrentUser() user: any) {
    if (updateDto.investigation && !updateDto.investigatedById) {
      updateDto.investigatedById = user.id;
    }
    return this.incidentService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete incident report' })
  remove(@Param('id') id: string) {
    return this.incidentService.remove(id);
  }
}

