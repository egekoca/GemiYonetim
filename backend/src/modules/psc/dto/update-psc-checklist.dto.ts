import { PartialType } from '@nestjs/swagger';
import { CreatePSCChecklistDto } from './create-psc-checklist.dto';

export class UpdatePSCChecklistDto extends PartialType(CreatePSCChecklistDto) {}

