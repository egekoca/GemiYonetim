import { PartialType } from '@nestjs/swagger';
import { CreateEngineLogDto } from './create-engine-log.dto';

export class UpdateEngineLogDto extends PartialType(CreateEngineLogDto) {}

