import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VesselsService } from './vessels.service';
import { CreateVesselDto } from './dto/create-vessel.dto';
import { UpdateVesselDto } from './dto/update-vessel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Vessels')
@Controller('vessels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VesselsController {
  constructor(private readonly vesselsService: VesselsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DPA_OFFICE)
  @ApiOperation({ summary: 'Create a new vessel' })
  create(@Body() createVesselDto: CreateVesselDto) {
    return this.vesselsService.create(createVesselDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vessels' })
  findAll() {
    return this.vesselsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vessel by ID' })
  findOne(@Param('id') id: string) {
    return this.vesselsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DPA_OFFICE)
  @ApiOperation({ summary: 'Update vessel' })
  update(@Param('id') id: string, @Body() updateVesselDto: UpdateVesselDto) {
    return this.vesselsService.update(id, updateVesselDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete vessel' })
  remove(@Param('id') id: string) {
    return this.vesselsService.remove(id);
  }
}

