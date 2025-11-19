import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigServiceService } from '../../core/services/api-config-service.service';

export interface EmployeeDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
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
export class EmployeesService {
  private readonly baseUrl = 'http://localhost:8081/api/admin/employees';
  private readonly apiConfig = inject(ApiConfigServiceService);

  constructor(private http: HttpClient) {}

  getEmployees(page: number, size: number, q?: string): Observable<PageResponse<EmployeeDto>> {
    const userDetailsUrl = this.apiConfig.getEndpoint('userEndPoints');
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (q && q.trim().length > 0) {
      params = params.set('q', q.trim());
    }

    return this.http.get<PageResponse<EmployeeDto>>(`${userDetailsUrl}/admin/employees`, { params });
  }
}
