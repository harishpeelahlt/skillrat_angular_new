import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../../../auth/authservice/authservice.service';
import { CurrentUserResponse } from '../../../auth/Models/auth.interfaces';
import { Project, ProjectService } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  showProjectForm = false;

  projects: Project[] = [];
  isLoadingProjects = false;
  projectsError: string | null = null;

  private currentUser: CurrentUserResponse | null = null;
  private subscription?: Subscription;

  constructor(
    private authService: AuthserviceService,
    private projectService: ProjectService,
    private MatSnackBar : MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user: CurrentUserResponse | null) => {
      this.currentUser = user;
      if (user?.b2bUnitId) {
        this.loadProjects(user.b2bUnitId);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openProjectForm(): void {
    this.showProjectForm = true;
  }

  onProjectFormClosed(success: boolean): void {
    this.showProjectForm = false;
    if (success && this.currentUser?.b2bUnitId) {
      this.loadProjects(this.currentUser.b2bUnitId);
    }
  }

  private loadProjects(b2bUnitId: string): void {
    this.isLoadingProjects = true;
    this.projectsError = null;

    this.projectService.getProjectsByB2BUnit(b2bUnitId).subscribe({
      next: (page) => {
        this.projects = page.content;
        this.isLoadingProjects = false;
      },
      error: () => {
        this.projectsError = 'Failed to load projects. Please try again.';
        this.isLoadingProjects = false;
      }
    });
  }

  openIncidentsDashboard(): void {
    if(this.projects.length > 0) {
      window.open('/incidents', '_blank');
    }
    else {
      this.MatSnackBar.open('No projects found', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
    
  }
}
