import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthserviceService } from '../../../auth/authservice/authservice.service';
import { CurrentUserResponse } from '../../../auth/Models/auth.interfaces';

interface RoleResponse {
  id: string;
  name: string;
}

interface CreateUserPayload {
  b2bUnitId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  roleIds: string[];
}

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.css',
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
export class UsersFormComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<boolean>();

  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showShake = false;

  roles: { id: string; name: string }[] = [];
  private currentUser: CurrentUserResponse | null = null;
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthserviceService,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      roleId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user: CurrentUserResponse | null) => {
      this.currentUser = user;
    });
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(success: boolean = false): void {
    this.closed.emit(success);
  }

  private loadRoles(): void {
    this.http
      .get<RoleResponse[]>('http://localhost:8081/api/roles/all')
      .subscribe({
        next: (data) => {
          const map = new Map<string, string>();
          (data || []).forEach((r) => {
            if (r.name && r.id && !map.has(r.name)) {
              map.set(r.name, r.id);
            }
          });
          this.roles = Array.from(map.entries()).map(([name, id]) => ({ id, name }));
        },
        error: (err) => {
          console.error('Failed to load roles for user form', err);
          this.roles = [];
        }
      });
  }

  submit(): void {
    if (this.form.invalid || !this.currentUser?.b2bUnitId) {
      this.form.markAllAsTouched();
      if (!this.currentUser?.b2bUnitId) {
        this.errorMessage = 'User context is missing. Please re-login.';
      }
      this.triggerShake();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const value = this.form.value;
    const payload: CreateUserPayload = {
      b2bUnitId: this.currentUser.b2bUnitId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      mobile: value.mobile,
      roleIds: [value.roleId]
    };

    this.http.post('http://localhost:8081/api/admin/users', payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close(true);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to create user. Please try again.';
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
