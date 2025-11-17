import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from './auth/authservice/authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ng18-ngmodel-app';

  constructor(private authService: AuthserviceService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.authService.getCurrentUser().subscribe({
        next: () => {
          // User is authenticated, ensure they are on a protected route
          if (this.router.url === '/' || this.router.url.startsWith('/auth')) {
            this.router.navigate(['/layout']);
          }
        },
        error: () => {
          // Token invalid or expired
          localStorage.removeItem('access_token');
          this.router.navigate(['/auth/login']);
        }
      });
    }
  }
}
