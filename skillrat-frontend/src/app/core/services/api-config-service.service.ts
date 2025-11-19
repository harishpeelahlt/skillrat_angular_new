import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface ApiConfig {
  baseUrl: string;
  endpoints: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ApiConfigServiceService {

   private config: ApiConfig | null = null;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      const config = await firstValueFrom(this.http.get<ApiConfig>('assets/api-config.json'));
      this.config = config;
    } catch (error) {
      throw new Error('Failed to load API configuration. Please check assets/api-config.json');
    }
  }

  getEndpoint(key: string): string {
    if (!this.config) {
      throw new Error('API config not loaded. Call loadConfig() first.');
    }
    const relativePath = this.config.endpoints[key];
    if (!relativePath) {
      throw new Error(`Endpoint '${key}' not found in API configuration.`);
    }
    return `${this.config.baseUrl}${relativePath}`;
  }
}
