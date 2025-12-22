import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VesselsModule } from './modules/vessels/vessels.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { SyncModule } from './modules/sync/sync.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { CrewModule } from './modules/crew/crew.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { VoyagesModule } from './modules/voyages/voyages.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { LogbookModule } from './modules/logbook/logbook.module';
import { EngineLogModule } from './modules/engine-log/engine-log.module';
import { FuelManagementModule } from './modules/fuel-management/fuel-management.module';
import { PSCModule } from './modules/psc/psc.module';
import { SafetyModule } from './modules/safety/safety.module';
import { IncidentModule } from './modules/incident/incident.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VesselContextInterceptor } from './common/interceptors/vessel-context.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    VesselsModule,
    DocumentsModule,
    CategoriesModule,
    CertificatesModule,
    SyncModule,
    NotificationsModule,
    AuditLogsModule,
    CrewModule,
    InventoryModule,
    ProcurementModule,
    MaintenanceModule,
    VoyagesModule,
    AnalyticsModule,
    LogbookModule,
    EngineLogModule,
    FuelManagementModule,
    PSCModule,
    SafetyModule,
    IncidentModule,
  ],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_INTERCEPTOR,
          useClass: VesselContextInterceptor,
        },
      ],
    })
    export class AppModule {}

