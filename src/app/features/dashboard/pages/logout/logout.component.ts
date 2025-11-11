import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: `<h3>Logout</h3><p>You have been logged out.</p>`
})
export class LogoutComponent {
  // Placeholder: any real logout logic (clearing tokens) would live elsewhere
}
