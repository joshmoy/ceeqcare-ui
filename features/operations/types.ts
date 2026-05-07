export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type StaffRole =
  | 'CARE_WORKER'
  | 'SENIOR_CARE_WORKER'
  | 'REGISTERED_MANAGER'
  | 'OPERATIONS_MANAGER'
  | 'QUALITY_COMPLIANCE_LEAD'
  | 'OTHER';

export type TrainingStatus = 'COMPLIANT' | 'DUE_SOON' | 'EXPIRED' | 'UNKNOWN';

export type VisitStatus =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'LATE'
  | 'MISSED'
  | 'CANCELLED';

export type IncidentType =
  | 'SAFEGUARDING'
  | 'MEDICATION_ERROR'
  | 'COMPLAINT'
  | 'MISSED_CALL'
  | 'OTHER';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  email?: string | null;
  phone?: string | null;
  trainingStatus: TrainingStatus;
  weeklyHours?: string | number | null;
  fatigueScore: number;
  createdAt: string;
};

export type Client = {
  id: string;
  name: string;
  reference?: string | null;
  postcode?: string | null;
  isActive: boolean;
  createdAt: string;
};

export type Visit = {
  id: string;
  staffId: string;
  clientId: string;
  scheduledStart: string;
  scheduledEnd?: string | null;
  actualStart?: string | null;
  actualEnd?: string | null;
  status: VisitStatus;
  travelDuration?: number | null;
  staff?: Pick<Staff, 'id' | 'name' | 'role' | 'fatigueScore'>;
  client?: Pick<Client, 'id' | 'name' | 'reference'>;
};

export type Incident = {
  id: string;
  staffId?: string | null;
  clientId?: string | null;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  occurredAt: string;
  resolvedAt?: string | null;
  staff?: Pick<Staff, 'id' | 'name' | 'role'> | null;
  client?: Pick<Client, 'id' | 'name' | 'reference'> | null;
};

export type CreateStaffInput = {
  name: string;
  role?: StaffRole;
  email?: string;
  phone?: string;
  trainingStatus?: TrainingStatus;
  weeklyHours?: number;
  fatigueScore?: number;
};

export type CreateClientInput = {
  name: string;
  reference?: string;
  postcode?: string;
  isActive?: boolean;
};

export type CreateVisitInput = {
  staffId: string;
  clientId: string;
  scheduledStart: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  status?: VisitStatus;
  travelDuration?: number;
};

export type CreateIncidentInput = {
  staffId?: string;
  clientId?: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  occurredAt: string;
  resolvedAt?: string;
};
