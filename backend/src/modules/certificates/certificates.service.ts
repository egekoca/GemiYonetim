import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Between } from 'typeorm';
import { Certificate } from '../../entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certificatesRepository: Repository<Certificate>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto): Promise<Certificate> {
    const certificate = this.certificatesRepository.create(createCertificateDto);
    return this.certificatesRepository.save(certificate);
  }

  async findAll(): Promise<Certificate[]> {
    return this.certificatesRepository.find({
      relations: ['document'],
    });
  }

  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.certificatesRepository.findOne({
      where: { id },
      relations: ['document'],
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async findByDocumentId(docId: string): Promise<Certificate | null> {
    return this.certificatesRepository.findOne({
      where: { docId },
      relations: ['document'],
    });
  }

  async findExpiringSoon(days: number = 30): Promise<Certificate[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.certificatesRepository.find({
      where: {
        expiryDate: Between(today, futureDate),
      },
      relations: ['document'],
    });
  }

  async findExpired(): Promise<Certificate[]> {
    const today = new Date();

    return this.certificatesRepository.find({
      where: {
        expiryDate: LessThanOrEqual(today),
      },
      relations: ['document'],
    });
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto): Promise<Certificate> {
    await this.certificatesRepository.update(id, updateCertificateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.certificatesRepository.delete(id);
  }
}

