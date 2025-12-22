import { PartialType } from '@nestjs/swagger';
import { CreateSafetyDrillDto } from './create-safety-drill.dto';

export class UpdateSafetyDrillDto extends PartialType(CreateSafetyDrillDto) {}

