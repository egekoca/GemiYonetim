import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { Document, DocumentStatus } from '../../entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../../entities/audit-log.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileHash = createHash('sha256').update(file.buffer).digest('hex');

    const document = this.documentsRepository.create({
      ...createDocumentDto,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      filePath: `uploads/${fileHash}-${file.originalname}`,
      fileHash,
      uploadedById: userId,
      status: DocumentStatus.DRAFT,
    });

    const savedDocument = await this.documentsRepository.save(document);

    await this.auditLogsService.create({
      userId,
      action: AuditAction.CREATE,
      entityType: 'Document',
      entityId: savedDocument.id,
      metadata: { fileName: file.originalname },
    });

    return savedDocument;
  }

  async findAll(vesselId?: string): Promise<Document[]> {
    const where: any = { isActive: true };
    if (vesselId) {
      where.vesselId = vesselId;
    }

    return this.documentsRepository.find({
      where,
      relations: ['vessel', 'category', 'uploadedBy', 'certificate'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['vessel', 'category', 'uploadedBy', 'certificate'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async approve(id: string, userId: string): Promise<Document> {
    const document = await this.findOne(id);
    document.status = DocumentStatus.APPROVED;
    const updated = await this.documentsRepository.save(document);

    await this.auditLogsService.create({
      userId,
      action: AuditAction.APPROVE,
      entityType: 'Document',
      entityId: id,
    });

    return updated;
  }

  async reject(id: string, userId: string, reason?: string): Promise<Document> {
    const document = await this.findOne(id);
    document.status = DocumentStatus.REJECTED;
    const updated = await this.documentsRepository.save(document);

    await this.auditLogsService.create({
      userId,
      action: AuditAction.REJECT,
      entityType: 'Document',
      entityId: id,
      metadata: { reason },
    });

    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.documentsRepository.delete(id);
  }

  async trackDownload(id: string, userId: string): Promise<void> {
    await this.auditLogsService.create({
      userId,
      action: AuditAction.DOWNLOAD,
      entityType: 'Document',
      entityId: id,
    });
  }
}

