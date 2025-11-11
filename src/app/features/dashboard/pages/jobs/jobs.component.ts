import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `<h3>Jobs</h3><p>Jobs content goes here.</p>`
})
export class JobsComponent {}
