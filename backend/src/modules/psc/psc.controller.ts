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
import { PSCService } from './psc.service';
import { CreatePSCChecklistDto } from './dto/create-psc-checklist.dto';
import { UpdatePSCChecklistDto } from './dto/update-psc-checklist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('PSC')
@Controller('psc')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PSCController {
  constructor(private readonly pscService: PSCService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PSC checklist' })
  create(@Body() createDto: CreatePSCChecklistDto, @CurrentUser() user: any) {
    return this.pscService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PSC checklists' })
  findAll(
    @Query('vesselId') vesselId?: string,
    @CurrentUser() user?: any,
  ) {
    const finalVesselId =
      user?.role === UserRole.SYSTEM_ADMIN || user?.role === UserRole.DPA_OFFICE
        ? vesselId
        : user?.vesselId || vesselId;
    return this.pscService.findAll(finalVesselId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get PSC checklist by ID' })
  findOne(@Param('id') id: string) {
    return this.pscService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update PSC checklist' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePSCChecklistDto) {
    return this.pscService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete PSC checklist' })
  remove(@Param('id') id: string) {
    return this.pscService.remove(id);
  }
}

