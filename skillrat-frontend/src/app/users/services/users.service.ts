import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly baseUrl = 'http://localhost:8081/api/admin/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number, size: number, q?: string, role?: string): Observable<PageResponse<UserDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (q && q.trim().length > 0) {
      params = params.set('q', q.trim());
    }

    if (role && role.trim().length > 0) {
      params = params.set('role', role.trim());
    }

    return this.http.get<PageResponse<UserDto>>(this.baseUrl, { params });
  }
}
