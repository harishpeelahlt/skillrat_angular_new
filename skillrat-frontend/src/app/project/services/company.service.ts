import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigServiceService } from '../../core/services/api-config-service.service';

export interface CompanyOnboardPayload {
  name: string;
  type: 'COMPANY' | 'COLLEGE' | 'SCHOOL' | 'OTHER';
  contactEmail: string;
  contactPhone: string;
  website: string;
  groupName: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly baseUrl = 'http://localhost:8082/api/b2b/onboard/self';
  private readonly apiConfig = inject(ApiConfigServiceService);

  constructor(private http: HttpClient) {}

  onboardCompany(payload: CompanyOnboardPayload): Observable<any> {
    const organizationEndPointUrl = this.apiConfig.getEndpoint('organizationEndPoint');
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    return this.http.post(`${organizationEndPointUrl}/b2b/onboard/self`, payload, { headers });
  }

  getAllCompanies(): Observable<any> {
    const userDetailsUrl = this.apiConfig.getEndpoint('userEndPoints');
    return this.http.get(`${userDetailsUrl}/users/me/business`)
  }
}
