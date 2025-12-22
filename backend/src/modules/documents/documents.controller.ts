import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDocumentDto })
  @ApiOperation({ summary: 'Upload a new document' })
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.documentsService.create(createDocumentDto, file, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  findAll(@Query('vesselId') vesselId?: string, @CurrentUser() user?: any) {
    // If user is not admin/DPA, use their vesselId
    const finalVesselId = 
      (user?.role === UserRole.SYSTEM_ADMIN || user?.role === UserRole.DPA_OFFICE)
        ? vesselId
        : user?.vesselId || vesselId;
    return this.documentsService.findAll(finalVesselId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update document' })
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DPA_OFFICE, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Approve document' })
  approve(@Param('id') id: string, @Request() req) {
    return this.documentsService.approve(id, req.user.id);
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DPA_OFFICE, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Reject document' })
  reject(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    return this.documentsService.reject(id, req.user.id, reason);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download document (tracks audit)' })
  async download(@Param('id') id: string, @Request() req) {
    await this.documentsService.trackDownload(id, req.user.id);
    const document = await this.documentsService.findOne(id);
    return { filePath: document.filePath, fileName: document.fileName };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}

