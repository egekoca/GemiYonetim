import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Voyage } from './voyage.entity';
import { Port } from './port.entity';

export enum PortCallType {
  LOADING = 'LOADING',
  DISCHARGE = 'DISCHARGE',
  BUNKERING = 'BUNKERING',
  REPAIR = 'REPAIR',
  CREW_CHANGE = 'CREW_CHANGE',
  OTHER = 'OTHER',
}

@Entity('port_calls')
export class PortCall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Voyage, (voyage) => voyage.portCalls)
  @JoinColumn({ name: 'voyage_id' })
  voyage: Voyage;

  @Column()
  voyageId: string;

  @ManyToOne(() => Port, (port) => port.portCalls)
  @JoinColumn({ name: 'port_id' })
  port: Port;

  @Column()
  portId: string;

  @Column({
    type: 'enum',
    enum: PortCallType,
  })
  callType: PortCallType;

  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  departureTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  portCharges: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

