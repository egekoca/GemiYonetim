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
import { InventoryItem } from './inventory-item.entity';

@Entity('inventory_locations')
export class InventoryLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => Vessel, (vessel) => vessel.inventoryLocations)
  @JoinColumn({ name: 'vessel_id' })
  vessel: Vessel;

  @Column()
  vesselId: string;

  @OneToMany(() => InventoryItem, (item) => item.location)
  items: InventoryItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

