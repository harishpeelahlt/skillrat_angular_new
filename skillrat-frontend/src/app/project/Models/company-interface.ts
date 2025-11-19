
export interface Address {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  tenantId: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  fullText: string | null;
}

export interface Group {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  tenantId: string;
  name: string;
}

export interface Business {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  tenantId: string;
  name: string;
  type: string; 
  status: string; 
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: Address;
  group: Group;
  onboardedBy: string; 
  approvedBy: string | null;
  approvedAt: string | null;
}

export interface CompanyResponse {
  business: Business;
  roles: string[];
  b2bUnitId: string;
  id: string; 
  email: string;
}