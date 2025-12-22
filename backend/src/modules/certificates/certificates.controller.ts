import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Certificates')
@Controller('certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new certificate' })
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificatesService.create(createCertificateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all certificates' })
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get certificates expiring soon' })
  findExpiringSoon(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.certificatesService.findExpiringSoon(daysNum);
  }

  @Get('expired')
  @ApiOperation({ summary: 'Get expired certificates' })
  findExpired() {
    return this.certificatesService.findExpired();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certificate by ID' })
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update certificate' })
  update(@Param('id') id: string, @Body() updateCertificateDto: UpdateCertificateDto) {
    return this.certificatesService.update(id, updateCertificateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete certificate' })
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(id);
  }
}

