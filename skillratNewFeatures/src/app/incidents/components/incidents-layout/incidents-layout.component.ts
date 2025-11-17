import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../../../auth/authservice/authservice.service';
import { CurrentUserResponse } from '../../../auth/Models/auth.interfaces';
import { PageResponse, Project, ProjectService } from '../../../project/services/project.service';
import { IncidentsContextService } from '../../services/incidents-context.service';

@Component({
  selector: 'app-incidents-layout',
  templateUrl: './incidents-layout.component.html',
  styleUrl: './incidents-layout.component.css'
})
export class IncidentsLayoutComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  isLoadingProjects = false;
  projectsError: string | null = null;

  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  selectedProjectName: string | null = null;

  private currentUser: CurrentUserResponse | null = null;
  private subscription?: Subscription;

  constructor(
    private authService: AuthserviceService,
    private projectService: ProjectService,
    private incidentsContext: IncidentsContextService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user: CurrentUserResponse | null) => {
      this.currentUser = user;
      if (user?.b2bUnitId) {
        this.page = 0;
        this.size = 10;
        this.loadProjects(user.b2bUnitId, this.page, this.size, true);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get hasMoreProjects(): boolean {
    return this.totalElements > this.projects.length;
  }

  onSeeMoreProjects(): void {
    if (!this.currentUser?.b2bUnitId) {
      return;
    }

    const nextSize = this.size + 10;
    this.size = nextSize;
    this.loadProjects(this.currentUser.b2bUnitId, this.page, this.size, false);
  }

  onSelectProject(project: Project): void {
    this.selectedProjectName = project.name;
    this.incidentsContext.setSelectedProject(project);
  }

  private loadProjects(b2bUnitId: string, page: number, size: number, resetSelection: boolean): void {
    this.isLoadingProjects = true;
    this.projectsError = null;

    this.projectService.getProjectsByB2BUnit(b2bUnitId, page, size).subscribe({
      next: (response: PageResponse<Project>) => {
        this.projects = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        if (resetSelection && this.projects.length > 0) {
          const firstProject = this.projects[0];
          this.selectedProjectName = firstProject.name;
          this.incidentsContext.setSelectedProject(firstProject);
        }
        this.isLoadingProjects = false;
      },
      error: () => {
        this.projectsError = 'Failed to load projects. Please try again.';
        this.isLoadingProjects = false;
      }
    });
  }
}
