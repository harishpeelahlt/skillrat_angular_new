import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentUserResponse, LoginPayload, RegisterPayload, TokenResponse } from '../Models/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private readonly baseUrl = 'http://localhost:8081/api/users';
  private readonly tokenUrl = 'http://localhost:8080/oauth2/token';

  private readonly currentUserSubject = new BehaviorSubject<CurrentUserResponse | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(payload: RegisterPayload): Observable<any> {
    const url = `${this.baseUrl}/signup`;
    return this.http.post<any>(url, payload);
  }

  getCurrentUser(): Observable<CurrentUserResponse> {
    const url = `http://localhost:8081/api/users/me/business`;
    return this.http.get<CurrentUserResponse>(url).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  login(payload: LoginPayload): Observable<TokenResponse> {
    const body = new HttpParams()
      .set('grant_type', 'urn:ietf:params:oauth:grant-type:skillrat-password')
      .set('username', payload.username)
      .set('password', payload.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic Z2F0ZXdheTpnYXRld2F5LXNlY3JldA=='
    });

    return this.http.post<TokenResponse>(this.tokenUrl, body.toString(), { headers }).pipe(
      tap((response) => {
        if (response?.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
      })
    );
  }
}
