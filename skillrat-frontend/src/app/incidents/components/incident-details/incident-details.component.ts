import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident, IncidentComment, IncidentService } from '../../services/incident.service';
import { EmployeeDto, EmployeesService } from '../../../users/services/employees.service';

@Component({
    selector: 'app-incident-details',
    templateUrl: './incident-details.component.html',
    styleUrl: './incident-details.component.css',
    standalone: false
})
export class IncidentDetailsComponent implements OnInit {
  isEditingDescription = false;
  incidentId: string | null = null;

  incident: Incident | null = null;
  isLoading = false;
  loadError: string | null = null;

  statusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED'];
  priorityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  status: string = '';
  priority: string = '';

  isUpdatingStatus = false;

  employees: EmployeeDto[] = [];
  selectedAssigneeId: string = '';
  isUpdatingAssignee = false;
  reporterName: string = '';

  comments: IncidentComment[] = [];
  isLoadingComments = false;
  commentsError: string | null = null;

  newCommentBody: string = '';
  isPostingComment = false;

  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.incidentId = this.route.snapshot.paramMap.get('id');
    if (this.incidentId) {
      this.loadIncident(this.incidentId);
      this.loadComments(this.incidentId);
    }

    this.loadEmployees();
  }

  cancelDescriptionEdit(): void {
    this.isEditingDescription = false;
  }

  private loadIncident(id: string): void {
    this.isLoading = true;
    this.loadError = null;

    this.incidentService.getIncidentById(id).subscribe({
      next: (incident: Incident) => {
        this.incident = incident;
        this.status = incident.status;
        this.priority = incident.priority;
        this.selectedAssigneeId = incident.assigneeId ?? '';
        this.updateReporterName();
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Failed to load incident details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  addComment(): void {
    const trimmed = this.newCommentBody.trim();
    if (!this.incidentId || !trimmed || this.isPostingComment) {
      return;
    }

    this.isPostingComment = true;

    this.incidentService.postIncidentComment(this.incidentId, trimmed).subscribe({
      next: () => {
        this.newCommentBody = '';
        this.isPostingComment = false;
        this.loadComments(this.incidentId as string);
      },
      error: () => {
        this.isPostingComment = false;
      }
    });
  }

  private loadComments(id: string): void {
    this.isLoadingComments = true;
    this.commentsError = null;

    this.incidentService.getIncidentComments(id).subscribe({
      next: response => {
        this.comments = response.content || [];
        this.isLoadingComments = false;
      },
      error: () => {
        this.commentsError = 'Failed to load comments.';
        this.isLoadingComments = false;
      }
    });
  }

  onAssigneeChange(newAssigneeId: string): void {
    this.selectedAssigneeId = newAssigneeId;

    if (!this.incidentId || !newAssigneeId) {
      // Do not call API when "Not assigned" is selected or id is missing
      return;
    }

    this.isUpdatingAssignee = true;

    this.incidentService.updateIncidentReporter(this.incidentId, newAssigneeId).subscribe({
      next: (updated: Incident) => {
        this.incident = updated;
        this.updateReporterName();
        this.isUpdatingAssignee = false;
      },
      error: () => {
        this.isUpdatingAssignee = false;
      }
    });
  }

  private loadEmployees(): void {
    // Load first page with a reasonable size to populate dropdown
    this.employeesService.getEmployees(0, 100).subscribe({
      next: response => {
        this.employees = response.content || [];
        this.updateReporterName();
      },
      error: () => {
        this.employees = [];
      }
    });
  }

  private updateReporterName(): void {
    if (!this.incident || !this.incident.reporterId) {
      this.reporterName = 'N/A';
      return;
    }

    const match = this.employees.find(e => e.id === this.incident?.reporterId);
    this.reporterName = match?.firstName || this.incident.reporterId;
  }

  onStatusChange(newStatus: string): void {
    if (!this.incidentId || !newStatus || newStatus === this.incident?.status) {
      return;
    }

    this.isUpdatingStatus = true;

    this.incidentService.updateIncidentStatus(this.incidentId, newStatus).subscribe({
      next: (updated: Incident) => {
        this.status = updated.status;
        // Optionally reload full incident details to reflect any other changes
        this.loadIncident(this.incidentId as string);
        this.isUpdatingStatus = false;
      },
      error: () => {
        this.isUpdatingStatus = false;
      }
    });
  }

  getStatusBadgeClasses(status: string): string {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';
    const map: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      RESOLVED: 'bg-emerald-100 text-emerald-800',
      CLOSED: 'bg-gray-200 text-gray-800',
      REOPENED: 'bg-orange-100 text-orange-800'
    };
    return `${base} ${map[status] || 'bg-gray-100 text-gray-800'}`;
  }

  getPriorityBadgeClasses(priority: string): string {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold';
    const map: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-800',
      HIGH: 'bg-amber-100 text-amber-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      LOW: 'bg-gray-100 text-gray-800'
    };
    return `${base} ${map[priority] || 'bg-gray-100 text-gray-800'}`;
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) {
      return '-';
    }

    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) {
      return dateStr;
    }

    return d.toLocaleString();
  }
}
