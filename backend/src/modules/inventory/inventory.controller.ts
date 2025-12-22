import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { CreateInventoryLocationDto } from './dto/create-inventory-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Inventory Items
  @Post('items')
  @ApiOperation({ summary: 'Create a new inventory item' })
  createItem(@Body() createDto: CreateInventoryItemDto) {
    return this.inventoryService.createItem(createDto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get all inventory items' })
  findAllItems(@Query('vesselId') vesselId?: string, @Query('locationId') locationId?: string) {
    return this.inventoryService.findAllItems(vesselId, locationId);
  }

  @Get('items/low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  findLowStockItems(@Query('vesselId') vesselId?: string) {
    return this.inventoryService.findLowStockItems(vesselId);
  }

  @Get('items/expiring')
  @ApiOperation({ summary: 'Get expiring items' })
  findExpiringItems(@Query('days') days?: string, @Query('vesselId') vesselId?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.inventoryService.findExpiringItems(daysNum, vesselId);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  findItemById(@Param('id') id: string) {
    return this.inventoryService.findItemById(id);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update inventory item' })
  updateItem(@Param('id') id: string, @Body() updateDto: UpdateInventoryItemDto) {
    return this.inventoryService.updateItem(id, updateDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete inventory item' })
  removeItem(@Param('id') id: string) {
    return this.inventoryService.removeItem(id);
  }

  // Inventory Transactions
  @Post('transactions')
  @ApiOperation({ summary: 'Create a new inventory transaction' })
  createTransaction(@Body() createDto: CreateInventoryTransactionDto, @Request() req) {
    return this.inventoryService.createTransaction(createDto, req.user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all inventory transactions' })
  findAllTransactions(@Query('itemId') itemId?: string, @Query('vesselId') vesselId?: string) {
    return this.inventoryService.findAllTransactions(itemId, vesselId);
  }

  // Inventory Locations
  @Post('locations')
  @ApiOperation({ summary: 'Create a new inventory location' })
  createLocation(@Body() createDto: CreateInventoryLocationDto) {
    return this.inventoryService.createLocation(createDto);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get all inventory locations' })
  findAllLocations(@Query('vesselId') vesselId?: string) {
    return this.inventoryService.findAllLocations(vesselId);
  }

  @Get('locations/:id')
  @ApiOperation({ summary: 'Get inventory location by ID' })
  findLocationById(@Param('id') id: string) {
    return this.inventoryService.findLocationById(id);
  }

  @Put('locations/:id')
  @ApiOperation({ summary: 'Update inventory location' })
  updateLocation(@Param('id') id: string, @Body() updateDto: CreateInventoryLocationDto) {
    return this.inventoryService.updateLocation(id, updateDto);
  }

  @Delete('locations/:id')
  @ApiOperation({ summary: 'Delete inventory location' })
  removeLocation(@Param('id') id: string) {
    return this.inventoryService.removeLocation(id);
  }
}

