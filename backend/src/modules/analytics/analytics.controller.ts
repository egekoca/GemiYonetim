import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard KPIs' })
  getDashboardKPIs(@Query('vesselId') vesselId?: string) {
    return this.analyticsService.getDashboardKPIs(vesselId);
  }

  @Get('maintenance')
  @ApiOperation({ summary: 'Get maintenance statistics' })
  getMaintenanceStats(@Query('vesselId') vesselId?: string) {
    return this.analyticsService.getMaintenanceStats(vesselId);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory statistics' })
  getInventoryStats(@Query('vesselId') vesselId?: string) {
    return this.analyticsService.getInventoryStats(vesselId);
  }

  @Get('procurement')
  @ApiOperation({ summary: 'Get procurement statistics' })
  getProcurementStats(@Query('vesselId') vesselId?: string) {
    return this.analyticsService.getProcurementStats(vesselId);
  }
}

