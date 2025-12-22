import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Vessel } from './vessel.entity';
import { InventoryTransaction } from './inventory-transaction.entity';
import { InventoryLocation } from './inventory-location.entity';

export enum InventoryUnit {
  PIECE = 'PIECE',
  KILOGRAM = 'KILOGRAM',
  LITER = 'LITER',
  METER = 'METER',
  BOX = 'BOX',
  CARTON = 'CARTON',
  OTHER = 'OTHER',
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  partNumber: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({
    type: 'enum',
    enum: InventoryUnit,
    default: InventoryUnit.PIECE,
  })
  unit: InventoryUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => Vessel, (vessel) => vessel.inventoryItems)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @ManyToOne(() => InventoryLocation, (location) => location.items)
  @JoinColumn({ name: 'location_id' })
  location: InventoryLocation;

  @Column({ nullable: true })
  locationId: string;

  @OneToMany(() => InventoryTransaction, (transaction) => transaction.item)
  transactions: InventoryTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

