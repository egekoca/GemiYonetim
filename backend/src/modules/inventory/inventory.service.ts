import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction, TransactionType } from '../../entities/inventory-transaction.entity';
import { InventoryLocation } from '../../entities/inventory-location.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { CreateInventoryLocationDto } from './dto/create-inventory-location.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryTransaction)
    private inventoryTransactionRepository: Repository<InventoryTransaction>,
    @InjectRepository(InventoryLocation)
    private inventoryLocationRepository: Repository<InventoryLocation>,
  ) {}

  // Inventory Items
  async createItem(createDto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.inventoryItemRepository.create(createDto);
    return this.inventoryItemRepository.save(item);
  }

  async findAllItems(vesselId?: string, locationId?: string): Promise<InventoryItem[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    if (locationId) {
      where.locationId = locationId;
    }
    return this.inventoryItemRepository.find({
      where,
      relations: ['vessel', 'location'],
      order: { name: 'ASC' },
    });
  }

  async findItemById(id: string): Promise<InventoryItem> {
    const item = await this.inventoryItemRepository.findOne({
      where: { id },
      relations: ['vessel', 'location', 'transactions'],
    });

    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    return item;
  }

  async updateItem(id: string, updateDto: UpdateInventoryItemDto): Promise<InventoryItem> {
    await this.inventoryItemRepository.update(id, updateDto);
    return this.findItemById(id);
  }

  async removeItem(id: string): Promise<void> {
    await this.inventoryItemRepository.delete(id);
  }

  async findLowStockItems(vesselId?: string): Promise<InventoryItem[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    const items = await this.inventoryItemRepository.find({
      where,
      relations: ['vessel', 'location'],
    });

    return items.filter((item) => {
      if (!item.minimumQuantity) return false;
      return item.quantity <= item.minimumQuantity;
    });
  }

  async findExpiringItems(days: number = 30, vesselId?: string): Promise<InventoryItem[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const where: any = {
      expiryDate: LessThanOrEqual(futureDate),
    };
    if (vesselId) {
      where.vesselId = vesselId;
    }

    return this.inventoryItemRepository.find({
      where,
      relations: ['vessel', 'location'],
    });
  }

  // Inventory Transactions
  async createTransaction(
    createDto: CreateInventoryTransactionDto,
    userId: string,
  ): Promise<InventoryTransaction> {
    const item = await this.findItemById(createDto.itemId);

    // Update item quantity based on transaction type
    if (createDto.transactionType === TransactionType.IN) {
      item.quantity = Number(item.quantity) + Number(createDto.quantity);
    } else if (createDto.transactionType === TransactionType.OUT) {
      if (Number(item.quantity) < Number(createDto.quantity)) {
        throw new BadRequestException('Insufficient quantity in stock');
      }
      item.quantity = Number(item.quantity) - Number(createDto.quantity);
    } else if (createDto.transactionType === TransactionType.ADJUSTMENT) {
      item.quantity = Number(createDto.quantity);
    }

    await this.inventoryItemRepository.save(item);

    const transaction = this.inventoryTransactionRepository.create({
      ...createDto,
      createdById: userId,
    });
    return this.inventoryTransactionRepository.save(transaction);
  }

  async findAllTransactions(itemId?: string, vesselId?: string): Promise<InventoryTransaction[]> {
    const query = this.inventoryTransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.item', 'item')
      .leftJoinAndSelect('transaction.createdBy', 'createdBy')
      .orderBy('transaction.createdAt', 'DESC');

    if (itemId) {
      query.where('transaction.itemId = :itemId', { itemId });
    } else if (vesselId) {
      query.where('item.vesselId = :vesselId', { vesselId });
    }

    return query.getMany();
  }

  // Inventory Locations
  async createLocation(createDto: CreateInventoryLocationDto): Promise<InventoryLocation> {
    const location = this.inventoryLocationRepository.create(createDto);
    return this.inventoryLocationRepository.save(location);
  }

  async findAllLocations(vesselId?: string): Promise<InventoryLocation[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    return this.inventoryLocationRepository.find({
      where,
      relations: ['vessel', 'items'],
      order: { name: 'ASC' },
    });
  }

  async findLocationById(id: string): Promise<InventoryLocation> {
    const location = await this.inventoryLocationRepository.findOne({
      where: { id },
      relations: ['vessel', 'items'],
    });

    if (!location) {
      throw new NotFoundException(`Inventory location with ID ${id} not found`);
    }

    return location;
  }

  async updateLocation(
    id: string,
    updateDto: Partial<CreateInventoryLocationDto>,
  ): Promise<InventoryLocation> {
    await this.inventoryLocationRepository.update(id, updateDto);
    return this.findLocationById(id);
  }

  async removeLocation(id: string): Promise<void> {
    await this.inventoryLocationRepository.delete(id);
  }
}

