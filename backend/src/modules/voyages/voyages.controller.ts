import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VoyagesService } from './voyages.service';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { CreatePortCallDto } from './dto/create-port-call.dto';
import { CreateVoyageExpenseDto } from './dto/create-voyage-expense.dto';
import { CreatePortDto } from './dto/create-port.dto';
import { VoyageStatus } from '../../entities/voyage.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Voyages')
@Controller('voyages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VoyagesController {
  constructor(private readonly voyagesService: VoyagesService) {}

  // Voyages
  @Post()
  @ApiOperation({ summary: 'Create a new voyage' })
  createVoyage(@Body() createDto: CreateVoyageDto) {
    return this.voyagesService.createVoyage(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all voyages' })
  findAllVoyages(@Query('vesselId') vesselId?: string, @Query('status') status?: string) {
    return this.voyagesService.findAllVoyages(vesselId, status as VoyageStatus);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get voyage by ID' })
  findVoyageById(@Param('id') id: string) {
    return this.voyagesService.findVoyageById(id);
  }

  // Port Calls
  @Post('port-calls')
  @ApiOperation({ summary: 'Create a new port call' })
  createPortCall(@Body() createDto: CreatePortCallDto) {
    return this.voyagesService.createPortCall(createDto);
  }

  @Get('port-calls')
  @ApiOperation({ summary: 'Get all port calls' })
  findAllPortCalls(@Query('voyageId') voyageId?: string) {
    return this.voyagesService.findAllPortCalls(voyageId);
  }

  // Expenses
  @Post('expenses')
  @ApiOperation({ summary: 'Create a new voyage expense' })
  createExpense(@Body() createDto: CreateVoyageExpenseDto) {
    return this.voyagesService.createExpense(createDto);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Get all voyage expenses' })
  findAllExpenses(@Query('voyageId') voyageId?: string) {
    return this.voyagesService.findAllExpenses(voyageId);
  }

  // Ports
  @Post('ports')
  @ApiOperation({ summary: 'Create a new port' })
  createPort(@Body() createDto: CreatePortDto) {
    return this.voyagesService.createPort(createDto);
  }

  @Get('ports')
  @ApiOperation({ summary: 'Get all ports' })
  findAllPorts() {
    return this.voyagesService.findAllPorts();
  }

  @Get('ports/:id')
  @ApiOperation({ summary: 'Get port by ID' })
  findPortById(@Param('id') id: string) {
    return this.voyagesService.findPortById(id);
  }
}

