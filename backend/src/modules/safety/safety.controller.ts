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
import { SafetyService } from './safety.service';
import { CreateSafetyDrillDto } from './dto/create-safety-drill.dto';
import { UpdateSafetyDrillDto } from './dto/update-safety-drill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Safety')
@Controller('safety')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new safety drill' })
  create(@Body() createDto: CreateSafetyDrillDto, @CurrentUser() user: any) {
    return this.safetyService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all safety drills' })
  findAll(
    @Query('vesselId') vesselId?: string,
    @CurrentUser() user?: any,
  ) {
    const finalVesselId =
      user?.role === UserRole.SYSTEM_ADMIN || user?.role === UserRole.DPA_OFFICE
        ? vesselId
        : user?.vesselId || vesselId;
    return this.safetyService.findAll(finalVesselId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get safety drill by ID' })
  findOne(@Param('id') id: string) {
    return this.safetyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update safety drill' })
  update(@Param('id') id: string, @Body() updateDto: UpdateSafetyDrillDto) {
    return this.safetyService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete safety drill' })
  remove(@Param('id') id: string) {
    return this.safetyService.remove(id);
  }
}

