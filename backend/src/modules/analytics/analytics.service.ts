import { Injectable } from '@nestjs/common';
import { CrewService } from '../crew/crew.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { InventoryService } from '../inventory/inventory.service';
import { ProcurementService } from '../procurement/procurement.service';
import { VoyagesService } from '../voyages/voyages.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private crewService: CrewService,
    private maintenanceService: MaintenanceService,
    private inventoryService: InventoryService,
    private procurementService: ProcurementService,
    private voyagesService: VoyagesService,
  ) {}

  async getDashboardKPIs(vesselId?: string) {
    const [
      expiringCertificates,
      expiredCertificates,
      overdueTasks,
      lowStockItems,
      pendingRequests,
      activeVoyages,
    ] = await Promise.all([
      this.crewService.findExpiringCertificates(30),
      this.crewService.findExpiredCertificates(),
      this.maintenanceService.findOverdueTasks(vesselId),
      this.inventoryService.findLowStockItems(vesselId),
      this.procurementService.findAllRequests(vesselId).then((reqs) =>
        reqs.filter((r) => r.status === 'PENDING_APPROVAL'),
      ),
      this.voyagesService.findAllVoyages(vesselId, 'IN_PROGRESS'),
    ]);

    return {
      expiringCertificates: expiringCertificates.length,
      expiredCertificates: expiredCertificates.length,
      overdueTasks: overdueTasks.length,
      lowStockItems: lowStockItems.length,
      pendingRequests: pendingRequests.length,
      activeVoyages: activeVoyages.length,
    };
  }

  async getMaintenanceStats(vesselId?: string) {
    const tasks = await this.maintenanceService.findAllTasks(vesselId);
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const pending = tasks.filter((t) => t.status === 'PENDING').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const overdue = tasks.filter((t) => t.status === 'OVERDUE').length;

    return {
      total: tasks.length,
      completed,
      pending,
      inProgress,
      overdue,
    };
  }

  async getInventoryStats(vesselId?: string) {
    const items = await this.inventoryService.findAllItems(vesselId);
    const lowStock = items.filter(
      (item) => item.minimumQuantity && item.quantity <= item.minimumQuantity,
    ).length;
    const totalValue = items.reduce(
      (sum, item) => sum + (item.quantity * (item.unitPrice || 0)),
      0,
    );

    return {
      totalItems: items.length,
      lowStock,
      totalValue,
    };
  }

  async getProcurementStats(vesselId?: string) {
    const requests = await this.procurementService.findAllRequests(vesselId);
    const orders = await this.procurementService.findAllOrders(vesselId);
    const totalValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      totalRequests: requests.length,
      totalOrders: orders.length,
      totalValue,
    };
  }
}

