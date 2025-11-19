import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Incident, IncidentService } from '../../services/incident.service';
import { IncidentsContextService } from '../../services/incidents-context.service';
import { Project } from '../../../project/services/project.service';

@Component({
    selector: 'app-incident-dashboard',
    templateUrl: './incident-dashboard.component.html',
    styleUrl: './incident-dashboard.component.css',
    standalone: false
})
export class IncidentDashboardComponent implements OnInit, OnDestroy {
  selectedPriority: 'all' | 'critical' | 'high' | 'medium' | 'low' = 'all';

  incidents: Incident[] = [];
  isLoadingIncidents = false;
  incidentsError: string | null = null;

  private projectSubscription?: Subscription;
  private currentProjectId: string | null = null;

  showIncidentForm = false;

  constructor(
    private incidentsContext: IncidentsContextService,
    private incidentService: IncidentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectSubscription = this.incidentsContext.selectedProject$.subscribe((project: Project | null) => {
      if (project?.id) {
        this.currentProjectId = project.id;
        this.loadIncidents(project.id);
      } else {
        this.incidents = [];
        this.currentProjectId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.projectSubscription?.unsubscribe();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'CRITICAL':
        return 'priority-critical';
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  }

  openIncidentForm(): void {
    this.showIncidentForm = true;
  }

  onIncidentFormClosed(success: boolean): void {
    this.showIncidentForm = false;

    if (success && this.currentProjectId) {
      this.loadIncidents(this.currentProjectId);
    }
  }

  viewIncidentDetails(incident: Incident): void {
    if (!incident || !incident.id) {
      return;
    }
    this.router.navigate(['/incidents/details', incident.id]);
  }

  private loadIncidents(projectId: string): void {
    this.isLoadingIncidents = true;
    this.incidentsError = null;

    this.incidentService.getIncidentsByProject(projectId, 0, 20).subscribe({
      next: (response) => {
        this.incidents = response.content;
        this.isLoadingIncidents = false;
      },
      error: () => {
        this.incidentsError = 'Failed to load incidents. Please try again.';
        this.isLoadingIncidents = false;
      }
    });
  }
}
