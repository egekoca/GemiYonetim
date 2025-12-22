import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MaintenanceWorkOrder } from './maintenance-work-order.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity('maintenance_parts')
export class MaintenancePart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MaintenanceWorkOrder, (workOrder) => workOrder.parts)
  @JoinColumn({ name: 'work_order_id' })
  workOrder: MaintenanceWorkOrder;

  @Column()
  workOrderId: string;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'inventory_item_id' })
  inventoryItem: InventoryItem;

  @Column()
  inventoryItemId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

