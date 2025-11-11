import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  menuOpen = true;
  upcomingExams: Array<{ subject: string; date: string; status: 'Scheduled' | 'Ongoing' | 'Completed' }>= [
    { subject: 'Mathematics', date: '2025-11-20', status: 'Scheduled' },
    { subject: 'Physics', date: '2025-11-22', status: 'Scheduled' },
    { subject: 'Chemistry', date: '2025-11-25', status: 'Scheduled' },
    { subject: 'Biology', date: '2025-11-28', status: 'Scheduled' },
  ];

  trends: Array<{ title: string; value: string; delta: number }> = [
    { title: 'Practice Tests Taken', value: '34', delta: 8 },
    { title: 'Average Score', value: '78%', delta: 3 },
    { title: 'Study Hours (weekly)', value: '12.5h', delta: -1 },
  ];
  trendIndex = 0;
  get currentTrend() { return this.trends[this.trendIndex] || { title: '-', value: '-', delta: 0 }; }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  prevTrend() {
    this.trendIndex = (this.trendIndex - 1 + this.trends.length) % this.trends.length;
  }

  nextTrend() {
    this.trendIndex = (this.trendIndex + 1) % this.trends.length;
  }
}
