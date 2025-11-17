import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { IncidentService } from '../../services/incident.service';
import { IncidentsContextService } from '../../services/incidents-context.service';
import { Project } from '../../../project/services/project.service';

export interface IncidentCreatePayload {
  title: string;
  shortDescription: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'APPLICATION' | 'INFRASTRUCTURE' | 'SECURITY' | 'DATA' | 'OTHER';
  subCategory: string;
}

@Component({
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrl: './incident-form.component.css',
  animations: [
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' }))
      ])
    ])
  ]
})
export class IncidentFormComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<boolean>();

  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showShake = false;

  priorities: Array<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  categories: Array<'APPLICATION' | 'INFRASTRUCTURE' | 'SECURITY' | 'DATA' | 'OTHER'> = [
    'APPLICATION',
    'INFRASTRUCTURE',
    'SECURITY',
    'DATA',
    'OTHER'
  ];

  subCategoryOptions: Record<string, string[]> = {
    APPLICATION: ['UI', 'Backend', 'Integration', 'Performance'],
    INFRASTRUCTURE: ['Network', 'Database', 'Storage', 'Compute'],
    SECURITY: ['Authentication', 'Authorization', 'Vulnerability', 'Data breach'],
    DATA: ['Quality', 'Migration', 'Reporting', 'Analytics'],
    OTHER: ['Other']
  };

  currentProject: Project | null = null;
  private projectSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private incidentsContext: IncidentsContextService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      urgency: ['MEDIUM', [Validators.required]],
      impact: ['MEDIUM', [Validators.required]],
      category: ['APPLICATION', [Validators.required]],
      subCategory: ['Network', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.projectSubscription = this.incidentsContext.selectedProject$.subscribe(project => {
      this.currentProject = project;
    });

    // Ensure initial subcategory matches default category
    const initialCategory = this.form.get('category')?.value as string;
    this.updateSubCategoryDefault(initialCategory);

    this.form.get('category')?.valueChanges.subscribe(value => {
      this.updateSubCategoryDefault(value);
    });
  }

  ngOnDestroy(): void {
    this.projectSubscription?.unsubscribe();
  }

  get subCategoriesForSelectedCategory(): string[] {
    const category = this.form.get('category')?.value as string;
    return this.subCategoryOptions[category] || [];
  }

  close(success: boolean = false): void {
    this.closed.emit(success);
  }

  submit(): void {
    if (this.form.invalid || !this.currentProject?.id) {
      this.form.markAllAsTouched();
      if (!this.currentProject?.id) {
        this.errorMessage = 'No project selected. Please select a project and try again.';
      }
      this.triggerShake();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const value = this.form.value;
    const payload: IncidentCreatePayload = {
      title: value.title,
      shortDescription: value.shortDescription,
      urgency: value.urgency,
      impact: value.impact,
      category: value.category,
      subCategory: value.subCategory
    };

    this.incidentService.createIncident(this.currentProject.id, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close(true);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to create incident. Please try again.';
        this.triggerShake();
      }
    });
  }

  private updateSubCategoryDefault(category: string): void {
    const options = this.subCategoryOptions[category] || [];
    if (options.length) {
      this.form.get('subCategory')?.setValue(options[0], { emitEvent: false });
    } else {
      this.form.get('subCategory')?.setValue('', { emitEvent: false });
    }
  }

  private triggerShake(): void {
    this.showShake = false;
    setTimeout(() => {
      this.showShake = true;
      setTimeout(() => {
        this.showShake = false;
      }, 300);
    }, 0);
  }
}
