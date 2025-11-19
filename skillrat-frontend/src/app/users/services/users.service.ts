import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigServiceService } from '../../core/services/api-config-service.service';

export interface UserRoleDto {
  id: string;
  name: string;
}

export interface UserDto {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  roles: UserRoleDto[];
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

export interface UserPayload {
  b2bUnitId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  roleIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly baseUrl = 'http://localhost:8081/api/admin/users';
  private readonly apiConfig = inject(ApiConfigServiceService);

  constructor(private http: HttpClient) {}

  getUsers(
    page: number,
    size: number,
    q?: string,
    role?: string
  ): Observable<PageResponse<UserDto>> {
    const userDetailsUrl = this.apiConfig.getEndpoint('userEndPoints');
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (q && q.trim().length > 0) {
      params = params.set('q', q.trim());
    }

    if (role && role.trim().length > 0) {
      params = params.set('role', role.trim());
    }

    return this.http.get<PageResponse<UserDto>>(`${userDetailsUrl}/admin/users`, { params });
  }

  getAllRoles(): Observable<any> {
    const userDetailsUrl = this.apiConfig.getEndpoint('userEndPoints');
    return this.http.get<any>(`${userDetailsUrl}/roles/all`);
  }

  createUser(payload: UserPayload): Observable<any> {
    const userDetailsUrl = this.apiConfig.getEndpoint('userEndPoints');
    return this.http.post(`${userDetailsUrl}/admin/users`, payload);
  }

  updateUser(userId: string, payload: UserPayload): Observable<any> {
    const userDetailsUrl = this.apiConfig.getEndpoint('userEndPoints');
    return this.http.put(`${userDetailsUrl}/admin/users/${userId}`, payload);
  }
}
