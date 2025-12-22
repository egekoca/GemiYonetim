// Shared types between frontend and backend

export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  DPA_OFFICE = 'DPA_OFFICE',
  CAPTAIN = 'CAPTAIN',
  CHIEF_ENGINEER = 'CHIEF_ENGINEER',
  OFFICER = 'OFFICER',
}

export enum VesselType {
  TANKER = 'TANKER',
  BULKER = 'BULKER',
  CONTAINER = 'CONTAINER',
  GENERAL_CARGO = 'GENERAL_CARGO',
  OTHER = 'OTHER',
}

export enum CategoryType {
  CERTIFICATE = 'CERTIFICATE',
  TECHNICAL_DRAWING = 'TECHNICAL_DRAWING',
  HSEQ = 'HSEQ',
  JOURNAL = 'JOURNAL',
  TRAINING = 'TRAINING',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  vesselId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vessel {
  id: string;
  name: string;
  imoNumber: string;
  vesselType: VesselType;
  flag: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  type: CategoryType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileHash?: string;
  version: number;
  status: DocumentStatus;
  isActive: boolean;
  vesselId: string;
  categoryId: string;
  uploadedById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  id: string;
  docId: string;
  issueDate: Date;
  expiryDate: Date;
  warningThreshold: number;
  issuingAuthority: string;
  certificateNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

