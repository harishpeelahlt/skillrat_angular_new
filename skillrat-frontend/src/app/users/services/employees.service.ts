import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getEmployees(page: number, size: number, q?: string): Observable<PageResponse<EmployeeDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (q && q.trim().length > 0) {
      params = params.set('q', q.trim());
    }

    return this.http.get<PageResponse<EmployeeDto>>(this.baseUrl, { params });
  }
}
