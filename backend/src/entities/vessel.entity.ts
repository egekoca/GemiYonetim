import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Document } from './document.entity';
import { SyncQueue } from './sync-queue.entity';
import { CrewMember } from './crew-member.entity';
import { InventoryItem } from './inventory-item.entity';
import { InventoryLocation } from './inventory-location.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { MaintenanceSchedule } from './maintenance-schedule.entity';
import { Voyage } from './voyage.entity';

export enum VesselType {
  TANKER = 'TANKER',
  BULKER = 'BULKER',
  CONTAINER = 'CONTAINER',
  GENERAL_CARGO = 'GENERAL_CARGO',
  OTHER = 'OTHER',
}

@Entity('vessels')
export class Vessel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  imoNumber: string;

  @Column({
    type: 'enum',
    enum: VesselType,
  })
  vesselType: VesselType;

  @Column()
  flag: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @OneToMany(() => Document, (document) => document.vessel)
  documents: Document[];

  @OneToMany(() => SyncQueue, (syncQueue) => syncQueue.vessel)
  syncQueues: SyncQueue[];

  @OneToMany(() => CrewMember, (crewMember) => crewMember.vessel)
  crewMembers: CrewMember[];

  @OneToMany(() => InventoryItem, (item) => item.vessel)
  inventoryItems: InventoryItem[];

  @OneToMany(() => InventoryLocation, (location) => location.vessel)
  inventoryLocations: InventoryLocation[];

  @OneToMany(() => MaintenanceTask, (task) => task.vessel)
  maintenanceTasks: MaintenanceTask[];

  @OneToMany(() => MaintenanceSchedule, (schedule) => schedule.vessel)
  maintenanceSchedules: MaintenanceSchedule[];

  @OneToMany(() => Voyage, (voyage) => voyage.vessel)
  voyages: Voyage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

