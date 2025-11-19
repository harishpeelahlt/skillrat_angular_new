import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../project/services/project.service';
import { ApiConfigServiceService } from '../../core/services/api-config-service.service';

export interface IncidentProject {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  tenantId: string | null;
  name: string;
  code: string;
  description: string;
  b2bUnitId: string;
  holidayCalendarId: string | null;
  startDate: string;
  endDate: string;
  members: any[];
  client: any;
  status: string;
}

export interface Incident {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  tenantId: string | null;
  incidentNumber: string;
  project: IncidentProject;
  title: string;
  shortDescription: string;
  urgency: string;
  impact: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  category: string;
  subCategory: string;
  status: string;
  assigneeId: string | null;
  reporterId: string | null;
}

export interface IncidentComment {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  tenantId: string | null;
  authorId: string;
  body: string;
}

export interface IncidentCreatePayload {
  title: string;
  shortDescription: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'APPLICATION' | 'INFRASTRUCTURE' | 'SECURITY' | 'DATA' | 'OTHER';
  subCategory: string;
}

@Injectable({ providedIn: 'root' })
export class IncidentService {
  // private readonly baseUrl = 'http://localhost:8087/api/projects';
  // private readonly incidentDetailsBaseUrl = 'http://localhost:8087/api/incidents';
  private readonly apiConfig = inject(ApiConfigServiceService);

  constructor(private http: HttpClient) {}

  getIncidentsByProject(projectId: string, page = 0, size = 20): Observable<PageResponse<Incident>> {
    const projectsEndPointUrl = this.apiConfig.getEndpoint('projectsEndPoint');
    const url = `${projectsEndPointUrl}/projects/${projectId}/incidents`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Incident>>(url, { params });
  }

  createIncident(projectId: string, payload: IncidentCreatePayload): Observable<Incident> {
    const projectsEndPointUrl = this.apiConfig.getEndpoint('projectsEndPoint');
    const url = `${projectsEndPointUrl}/projects/${projectId}/incidents`;
    return this.http.post<Incident>(url, payload);
  }

  getIncidentById(id: string): Observable<Incident> {
    const projectsEndPointUrl = this.apiConfig.getEndpoint('projectsEndPoint');
    const url = `${projectsEndPointUrl}/incidents/${id}`;
    return this.http.get<Incident>(url);
  }

  updateIncidentStatus(id: string, status: string): Observable<Incident> {
    const projectsEndPointUrl = this.apiConfig.getEndpoint('projectsEndPoint');
    const url = `${projectsEndPointUrl}/incidents/${id}/status`;
    return this.http.put<Incident>(url, { status });
  }

  updateIncidentReporter(id: string, userId: string): Observable<Incident> {
    const projectsEndPointUrl = this.apiConfig.getEndpoint('projectsEndPoint');
    const url = `${projectsEndPointUrl}/incidents/${id}/reporter`;
    return this.http.put<Incident>(url, { userId });
  }

  getIncidentComments(id: string): Observable<PageResponse<IncidentComment>> {
    const projectsEndPointUrl = this.apiConfig.getEndpoint('projectsEndPoint');
    const url = `${projectsEndPointUrl}/incidents/${id}/comments`;
    return this.http.get<PageResponse<IncidentComment>>(url);
  }

  postIncidentComment(id: string, body: string): Observable<IncidentComment> {
    const projectsEndPointUrl = this.apiConfig.getEndpoint('projectsEndPoint');
    const url = `${projectsEndPointUrl}/incidents/${id}/comments`;
    return this.http.post<IncidentComment>(url, { body });
  }
}
