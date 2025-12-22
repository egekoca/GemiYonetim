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
import { FuelManagementService } from './fuel-management.service';
import { CreateFuelConsumptionDto } from './dto/create-fuel-consumption.dto';
import { UpdateFuelConsumptionDto } from './dto/update-fuel-consumption.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Fuel Management')
@Controller('fuel-management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FuelManagementController {
  constructor(private readonly fuelService: FuelManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fuel consumption record' })
  create(@Body() createDto: CreateFuelConsumptionDto, @CurrentUser() user: any) {
    return this.fuelService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fuel consumption records' })
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
    return this.fuelService.findAll(finalVesselId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fuel consumption record by ID' })
  findOne(@Param('id') id: string) {
    return this.fuelService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fuel consumption record' })
  update(@Param('id') id: string, @Body() updateDto: UpdateFuelConsumptionDto) {
    return this.fuelService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fuel consumption record' })
  remove(@Param('id') id: string) {
    return this.fuelService.remove(id);
  }
}

