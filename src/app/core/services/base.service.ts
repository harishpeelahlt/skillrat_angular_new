import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BaseService {
  protected http = inject(HttpClient);
  protected api = environment.apiBaseUrl;

  protected handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}
