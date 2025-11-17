import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../../../auth/authservice/authservice.service';
import { CurrentUserResponse } from '../../../auth/Models/auth.interfaces';
import { PageResponse, Project, ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  styleUrl: './projects.component.css',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  showProjectForm = false;

  projects: Project[] = [];
  isLoadingProjects = false;
  projectsError: string | null = null;

  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  private currentUser: CurrentUserResponse | null = null;
  private subscription?: Subscription;

  constructor(
    private authService: AuthserviceService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user: CurrentUserResponse | null) => {
      this.currentUser = user;
      if (user?.b2bUnitId) {
        this.loadProjects(user.b2bUnitId, this.page, this.size);
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
      this.loadProjects(this.currentUser.b2bUnitId, this.page, this.size);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1 && this.currentUser?.b2bUnitId) {
      this.page += 1;
      this.loadProjects(this.currentUser.b2bUnitId, this.page, this.size);
    }
  }

  previousPage(): void {
    if (this.page > 0 && this.currentUser?.b2bUnitId) {
      this.page -= 1;
      this.loadProjects(this.currentUser.b2bUnitId, this.page, this.size);
    }
  }

  private loadProjects(b2bUnitId: string, page: number, size: number): void {
    this.isLoadingProjects = true;
    this.projectsError = null;

    this.projectService.getProjectsByB2BUnit(b2bUnitId, page, size).subscribe({
      next: (response: PageResponse<Project>) => {
        this.projects = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoadingProjects = false;
      },
      error: () => {
        this.projectsError = 'Failed to load projects. Please try again.';
        this.isLoadingProjects = false;
      }
    });
  }
}

