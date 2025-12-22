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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrewService } from './crew.service';
import { CreateCrewMemberDto } from './dto/create-crew-member.dto';
import { UpdateCrewMemberDto } from './dto/update-crew-member.dto';
import { CreateCrewCertificateDto } from './dto/create-crew-certificate.dto';
import { CreateCrewTrainingDto } from './dto/create-crew-training.dto';
import { CreateCrewRotationDto } from './dto/create-crew-rotation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Crew')
@Controller('crew')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  // Crew Members
  @Post('members')
  @ApiOperation({ summary: 'Create a new crew member' })
  createCrewMember(@Body() createDto: CreateCrewMemberDto) {
    return this.crewService.createCrewMember(createDto);
  }

  @Get('members')
  @ApiOperation({ summary: 'Get all crew members' })
  findAllCrewMembers(@Query('vesselId') vesselId?: string) {
    return this.crewService.findAllCrewMembers(vesselId);
  }

  @Get('members/:id')
  @ApiOperation({ summary: 'Get crew member by ID' })
  findCrewMemberById(@Param('id') id: string) {
    return this.crewService.findCrewMemberById(id);
  }

  @Put('members/:id')
  @ApiOperation({ summary: 'Update crew member' })
  updateCrewMember(@Param('id') id: string, @Body() updateDto: UpdateCrewMemberDto) {
    return this.crewService.updateCrewMember(id, updateDto);
  }

  @Delete('members/:id')
  @ApiOperation({ summary: 'Delete crew member' })
  removeCrewMember(@Param('id') id: string) {
    return this.crewService.removeCrewMember(id);
  }

  // Certificates
  @Post('certificates')
  @ApiOperation({ summary: 'Create a new crew certificate' })
  createCertificate(@Body() createDto: CreateCrewCertificateDto) {
    return this.crewService.createCertificate(createDto);
  }

  @Get('certificates/expiring')
  @ApiOperation({ summary: 'Get expiring crew certificates' })
  findExpiringCertificates(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.crewService.findExpiringCertificates(daysNum);
  }

  @Get('certificates/expired')
  @ApiOperation({ summary: 'Get expired crew certificates' })
  findExpiredCertificates() {
    return this.crewService.findExpiredCertificates();
  }

  // Trainings
  @Post('trainings')
  @ApiOperation({ summary: 'Create a new crew training' })
  createTraining(@Body() createDto: CreateCrewTrainingDto) {
    return this.crewService.createTraining(createDto);
  }

  @Get('trainings')
  @ApiOperation({ summary: 'Get all crew trainings' })
  findAllTrainings(@Query('crewMemberId') crewMemberId?: string) {
    return this.crewService.findAllTrainings(crewMemberId);
  }

  // Rotations
  @Post('rotations')
  @ApiOperation({ summary: 'Create a new crew rotation' })
  createRotation(@Body() createDto: CreateCrewRotationDto) {
    return this.crewService.createRotation(createDto);
  }

  @Get('rotations')
  @ApiOperation({ summary: 'Get all crew rotations' })
  findAllRotations(
    @Query('crewMemberId') crewMemberId?: string,
    @Query('vesselId') vesselId?: string,
  ) {
    return this.crewService.findAllRotations(crewMemberId, vesselId);
  }
}

