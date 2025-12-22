import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcurementRequest, RequestStatus } from '../../entities/procurement-request.entity';
import { ProcurementOrder, OrderStatus } from '../../entities/procurement-order.entity';
import { ProcurementSupplier } from '../../entities/procurement-supplier.entity';
import { ProcurementQuote, QuoteStatus } from '../../entities/procurement-quote.entity';
import { CreateProcurementRequestDto } from './dto/create-procurement-request.dto';
import { CreateProcurementOrderDto } from './dto/create-procurement-order.dto';
import { CreateProcurementSupplierDto } from './dto/create-procurement-supplier.dto';
import { CreateProcurementQuoteDto } from './dto/create-procurement-quote.dto';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(ProcurementRequest)
    private requestRepository: Repository<ProcurementRequest>,
    @InjectRepository(ProcurementOrder)
    private orderRepository: Repository<ProcurementOrder>,
    @InjectRepository(ProcurementSupplier)
    private supplierRepository: Repository<ProcurementSupplier>,
    @InjectRepository(ProcurementQuote)
    private quoteRepository: Repository<ProcurementQuote>,
  ) {}

  // Procurement Requests
  async createRequest(createDto: CreateProcurementRequestDto): Promise<ProcurementRequest> {
    const request = this.requestRepository.create(createDto);
    // Generate request number
    const count = await this.requestRepository.count();
    request.requestNumber = `REQ-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    return this.requestRepository.save(request);
  }

  async findAllRequests(vesselId?: string): Promise<ProcurementRequest[]> {
    const where: any = {};
    if (vesselId) {
      where.vesselId = vesselId;
    }
    return this.requestRepository.find({
      where,
      relations: ['vessel', 'requestedBy', 'approvedBy', 'orders'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRequestById(id: string): Promise<ProcurementRequest> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['vessel', 'requestedBy', 'approvedBy', 'orders'],
    });

    if (!request) {
      throw new NotFoundException(`Procurement request with ID ${id} not found`);
    }

    return request;
  }

  async approveRequest(id: string, userId: string): Promise<ProcurementRequest> {
    const request = await this.findRequestById(id);
    request.status = RequestStatus.APPROVED;
    request.approvedById = userId;
    request.approvedAt = new Date();
    return this.requestRepository.save(request);
  }

  async rejectRequest(id: string, userId: string, reason: string): Promise<ProcurementRequest> {
    const request = await this.findRequestById(id);
    request.status = RequestStatus.REJECTED;
    request.approvedById = userId;
    request.rejectionReason = reason;
    return this.requestRepository.save(request);
  }

  // Procurement Orders
  async createOrder(createDto: CreateProcurementOrderDto): Promise<ProcurementOrder> {
    const order = this.orderRepository.create(createDto);
    // Generate order number
    const count = await this.orderRepository.count();
    order.orderNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    return this.orderRepository.save(order);
  }

  async findAllOrders(vesselId?: string, status?: OrderStatus): Promise<ProcurementOrder[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.request', 'request')
      .leftJoinAndSelect('order.supplier', 'supplier')
      .leftJoinAndSelect('order.createdBy', 'createdBy')
      .leftJoinAndSelect('order.approvedBy', 'approvedBy')
      .orderBy('order.createdAt', 'DESC');

    if (vesselId) {
      query.where('request.vesselId = :vesselId', { vesselId });
    }
    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    return query.getMany();
  }

  async findOrderById(id: string): Promise<ProcurementOrder> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['request', 'supplier', 'createdBy', 'approvedBy', 'quotes'],
    });

    if (!order) {
      throw new NotFoundException(`Procurement order with ID ${id} not found`);
    }

    return order;
  }

  async approveOrder(id: string, userId: string): Promise<ProcurementOrder> {
    const order = await this.findOrderById(id);
    order.status = OrderStatus.APPROVED;
    order.approvedById = userId;
    return this.orderRepository.save(order);
  }

  // Suppliers
  async createSupplier(createDto: CreateProcurementSupplierDto): Promise<ProcurementSupplier> {
    const supplier = this.supplierRepository.create(createDto);
    return this.supplierRepository.save(supplier);
  }

  async findAllSuppliers(): Promise<ProcurementSupplier[]> {
    return this.supplierRepository.find({
      where: { isActive: true },
      relations: ['orders', 'quotes'],
      order: { name: 'ASC' },
    });
  }

  async findSupplierById(id: string): Promise<ProcurementSupplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['orders', 'quotes'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  // Quotes
  async createQuote(createDto: CreateProcurementQuoteDto): Promise<ProcurementQuote> {
    const quote = this.quoteRepository.create(createDto);
    // Generate quote number
    const count = await this.quoteRepository.count();
    quote.quoteNumber = `QT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    return this.quoteRepository.save(quote);
  }

  async findAllQuotes(orderId?: string): Promise<ProcurementQuote[]> {
    const where: any = {};
    if (orderId) {
      where.orderId = orderId;
    }
    return this.quoteRepository.find({
      where,
      relations: ['supplier', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async acceptQuote(id: string): Promise<ProcurementQuote> {
    const quote = await this.quoteRepository.findOne({ where: { id } });
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    quote.status = QuoteStatus.ACCEPTED;
    return this.quoteRepository.save(quote);
  }
}

