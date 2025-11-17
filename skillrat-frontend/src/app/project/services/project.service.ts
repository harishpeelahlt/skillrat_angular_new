import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectClientPayload {
  name: string;
  primaryContactEmail: string;
  secondaryContactEmail: string;
}

export interface ProjectCreatePayload {
  name: string;
  code: string;
  b2bUnitId: string;
  startDate: string;
  endDate: string;
  description: string;
  client: ProjectClientPayload;
}

export interface ProjectClient {
  id: string;
  name: string;
  primaryContactEmail: string;
  secondaryContactEmail: string;
}

export interface Project {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  tenantId: string;
  name: string;
  code: string;
  description: string;
  b2bUnitId: string;
  holidayCalendarId: string | null;
  startDate: string;
  endDate: string;
  members: any[];
  client: ProjectClient;
  status: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly baseUrl = 'http://localhost:8087/api/projects';

  constructor(private http: HttpClient) {}

  createProject(payload: ProjectCreatePayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  getProjectsByB2BUnit(b2bUnitId: string, page = 0, size = 20): Observable<PageResponse<Project>> {
    const url = `${this.baseUrl}/byB2BUnit/${b2bUnitId}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Project>>(url, { params });
  }
}
