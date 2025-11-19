import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthTokenInterceptor } from './core/interceptor/auth-token.interceptor';
import { ApiConfigServiceService } from './core/services/api-config-service.service';

export function initializeApiConfig(apiConfigService: ApiConfigServiceService) {
  return () => apiConfigService.loadConfig();
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [
     provideAnimationsAsync(),
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
     },
     {
      provide: APP_INITIALIZER,
      useFactory: initializeApiConfig,
      deps: [ApiConfigServiceService],
      multi: true
     },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
