import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';
import { CreateProcurementRequestDto } from './dto/create-procurement-request.dto';
import { CreateProcurementOrderDto } from './dto/create-procurement-order.dto';
import { CreateProcurementSupplierDto } from './dto/create-procurement-supplier.dto';
import { CreateProcurementQuoteDto } from './dto/create-procurement-quote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Procurement')
@Controller('procurement')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  // Requests
  @Post('requests')
  @ApiOperation({ summary: 'Create a new procurement request' })
  createRequest(@Body() createDto: CreateProcurementRequestDto) {
    return this.procurementService.createRequest(createDto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get all procurement requests' })
  findAllRequests(@Query('vesselId') vesselId?: string) {
    return this.procurementService.findAllRequests(vesselId);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get procurement request by ID' })
  findRequestById(@Param('id') id: string) {
    return this.procurementService.findRequestById(id);
  }

  @Post('requests/:id/approve')
  @ApiOperation({ summary: 'Approve procurement request' })
  approveRequest(@Param('id') id: string, @Request() req) {
    return this.procurementService.approveRequest(id, req.user.id);
  }

  @Post('requests/:id/reject')
  @ApiOperation({ summary: 'Reject procurement request' })
  rejectRequest(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    return this.procurementService.rejectRequest(id, req.user.id, reason);
  }

  // Orders
  @Post('orders')
  @ApiOperation({ summary: 'Create a new procurement order' })
  createOrder(@Body() createDto: CreateProcurementOrderDto) {
    return this.procurementService.createOrder(createDto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all procurement orders' })
  findAllOrders(@Query('vesselId') vesselId?: string, @Query('status') status?: string) {
    return this.procurementService.findAllOrders(vesselId, status as any);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get procurement order by ID' })
  findOrderById(@Param('id') id: string) {
    return this.procurementService.findOrderById(id);
  }

  @Post('orders/:id/approve')
  @ApiOperation({ summary: 'Approve procurement order' })
  approveOrder(@Param('id') id: string, @Request() req) {
    return this.procurementService.approveOrder(id, req.user.id);
  }

  // Suppliers
  @Post('suppliers')
  @ApiOperation({ summary: 'Create a new supplier' })
  createSupplier(@Body() createDto: CreateProcurementSupplierDto) {
    return this.procurementService.createSupplier(createDto);
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Get all suppliers' })
  findAllSuppliers() {
    return this.procurementService.findAllSuppliers();
  }

  @Get('suppliers/:id')
  @ApiOperation({ summary: 'Get supplier by ID' })
  findSupplierById(@Param('id') id: string) {
    return this.procurementService.findSupplierById(id);
  }

  // Quotes
  @Post('quotes')
  @ApiOperation({ summary: 'Create a new quote' })
  createQuote(@Body() createDto: CreateProcurementQuoteDto) {
    return this.procurementService.createQuote(createDto);
  }

  @Get('quotes')
  @ApiOperation({ summary: 'Get all quotes' })
  findAllQuotes(@Query('orderId') orderId?: string) {
    return this.procurementService.findAllQuotes(orderId);
  }

  @Post('quotes/:id/accept')
  @ApiOperation({ summary: 'Accept a quote' })
  acceptQuote(@Param('id') id: string) {
    return this.procurementService.acceptQuote(id);
  }
}

