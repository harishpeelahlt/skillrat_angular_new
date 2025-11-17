import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../../../../auth/authservice/authservice.service';
import { CurrentUserResponse } from '../../../../auth/Models/auth.interfaces';
import { ProjectCreatePayload, ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
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
export class ProjectFormComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<boolean>();

  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  private currentUser: CurrentUserResponse | null = null;
  private subscription?: Subscription;
  showShake = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthserviceService,
    private projectService: ProjectService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      client: this.fb.group({
        name: ['', [Validators.required]],
        primaryContactEmail: ['', [Validators.required, Validators.email]],
        secondaryContactEmail: ['', [Validators.email]]
      })
    });
  }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user: CurrentUserResponse | null) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(success: boolean = false): void {
    this.closed.emit(success);
  }

  submit(): void {
    if (this.form.invalid || !this.currentUser) {
      this.form.markAllAsTouched();
      if (!this.currentUser) {
        this.errorMessage = 'User context is missing. Please re-login.';
      }
      this.triggerShake();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const value = this.form.value;
    const payload: ProjectCreatePayload = {
      name: value.name,
      code: value.code,
      b2bUnitId: this.currentUser.b2bUnitId,
      startDate: value.startDate,
      endDate: value.endDate,
      description: value.description,
      client: {
        name: value.client.name,
        primaryContactEmail: value.client.primaryContactEmail,
        secondaryContactEmail: value.client.secondaryContactEmail
      }
    };

    this.projectService.createProject(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close(true);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to create project. Please try again.';
        this.triggerShake();
      }
    });
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
