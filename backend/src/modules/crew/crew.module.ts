import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewService } from './crew.service';
import { CrewController } from './crew.controller';
import { CrewMember } from '../../entities/crew-member.entity';
import { CrewCertificate } from '../../entities/crew-certificate.entity';
import { CrewTraining } from '../../entities/crew-training.entity';
import { CrewRotation } from '../../entities/crew-rotation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrewMember, CrewCertificate, CrewTraining, CrewRotation]),
  ],
  controllers: [CrewController],
  providers: [CrewService],
  exports: [CrewService],
})
export class CrewModule {}

