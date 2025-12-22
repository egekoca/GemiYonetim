import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { CrewModule } from '../crew/crew.module';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { InventoryModule } from '../inventory/inventory.module';
import { ProcurementModule } from '../procurement/procurement.module';
import { VoyagesModule } from '../voyages/voyages.module';
import { DocumentsModule } from '../documents/documents.module';
import { CertificatesModule } from '../certificates/certificates.module';

@Module({
  imports: [
    CrewModule,
    MaintenanceModule,
    InventoryModule,
    ProcurementModule,
    VoyagesModule,
    DocumentsModule,
    CertificatesModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

