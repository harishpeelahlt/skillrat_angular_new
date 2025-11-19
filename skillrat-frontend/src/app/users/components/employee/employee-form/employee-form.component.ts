import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthserviceService } from '../../../../auth/authservice/authservice.service';
import { CurrentUserResponse } from '../../../../auth/Models/auth.interfaces';

interface RoleResponse {
  id: string;
  name: string;
}

interface CreateEmployeePayload {
  b2bUnitId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  designation: string;
  department: string;
  employmentType: string;
  hireDate: string;
  roleIds: string[];
}

@Component({
    selector: 'app-employee-form',
    templateUrl: './employee-form.component.html',
    styleUrl: './employee-form.component.css',
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
    ],
    standalone: false
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<boolean>();
  @Input() employee: any;

  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showShake = false;

  employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT'];
  roles: { id: string; name: string }[] = [];

  private currentUser: CurrentUserResponse | null = null;
  private subscription?: Subscription;

   get isEditMode(): boolean {
    return !!this.employee;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Edit Employee' : 'New Employee';
  }

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
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      employmentType: ['FULL_TIME', [Validators.required]],
      hireDate: ['', [Validators.required]],
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

   ngOnChanges(changes: SimpleChanges): void {
      if (changes['employee']) {
        if (this.employee) {
          this.populateForm();
        } else {
          this.form.reset();
        }
      }
    }

    private populateForm(): void {
    if (!this.employee) return;

    this.form.patchValue({
      firstName: this.employee.firstName || '',
      lastName: this.employee.lastName || '',
      email: this.employee.email || '',
      mobile: this.employee.mobile || '',
      designation: this.employee.designation || '',
      department: this.employee.department || '',
      employmentType: this.employee.employmentType || 'FULL_TIME',
      hireDate: this.employee.hireDate ? this.employee.hireDate.split('T')[0] : '',
      roleId: this.employee.roles && this.employee.roles.length > 0 ? this.employee.roles[0].id : ''
    });
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
          console.error('Failed to load roles for employee form', err);
          this.roles = [];
        }
      });
  }

  submit(): void {
    if (this.form.invalid || !this.currentUser?.b2bUnitId) {
      this.form.markAllAsTouched();
      if (!this.currentUser?.b2bUnitId) {
        this.errorMessage = !this.currentUser?.b2bUnitId
        ? 'User context is missing. Please re-login.'
        : 'Please fill all required fields correctly.';
      }
      this.triggerShake();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const value = this.form.value;
    const payload: CreateEmployeePayload = {
      b2bUnitId: this.currentUser.b2bUnitId,
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim(),
      mobile: value.mobile.trim(),
      designation: value.designation.trim(),
      department: value.department.trim(),
      employmentType: value.employmentType,
      hireDate: value.hireDate,
      roleIds: [value.roleId]
    };
    const employeeId = this.employee?.id;
    const url = employeeId
      ? `http://localhost:8081/api/admin/employees/${employeeId}`
      : 'http://localhost:8081/api/admin/employees';

      const httpCall = employeeId
      ? this.http.put(url, payload)
      : this.http.post(url, payload);
    httpCall.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close(true);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to create employee. Please try again.';
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
