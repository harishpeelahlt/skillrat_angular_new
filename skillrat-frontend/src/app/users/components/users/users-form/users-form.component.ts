import {Component,EventEmitter,Input,OnDestroy,OnInit,Output,SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDto, UsersService } from '../../../services/users.service';
import { CurrentUserResponse } from '../../../../auth/Models/auth.interfaces';
import { AuthserviceService } from '../../../../auth/authservice/authservice.service';

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
  standalone: false,
  animations: [
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('modal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' })
        ),
      ]),
    ]),
  ],
})
export class UsersFormComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<boolean>();
  @Input() user: UserDto | null = null;

  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showShake = false;

  roles: { id: string; name: string }[] = [];
  private currentUser: CurrentUserResponse | null = null;
  private subscription?: Subscription;
  get isEditMode(): boolean {
    return !!this.user;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Edit User' : 'New User';
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthserviceService,
    private http: HttpClient,
    private usersService: UsersService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe(
      (user: CurrentUserResponse | null) => {
        this.currentUser = user;
      }
    );
    this.loadRoles();
  }

  // This will run every time @Input() user changes (including on edit click)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      if (this.user) {
        this.populateForm();
      } else {
        this.form.reset();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(success: boolean = false): void {
    this.closed.emit(success);
  }

  private loadRoles(): void {
    this.usersService.getAllRoles().subscribe({
      next: (data) => {
        const map = new Map<string, string>();
        (data || []).forEach((r: any) => {
          if (r.name && r.id && !map.has(r.name)) {
            map.set(r.name, r.id);
          }
        });
        this.roles = Array.from(map.entries()).map(([name, id]) => ({
          id,
          name,
        }));
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        this.roles = [];
      },
    });
  }

  private populateForm(): void {
    if (!this.user) return;

    this.form.patchValue({
      firstName: this.user.firstName || '',
      lastName: this.user.lastName || '',
      email: this.user.email || '',
      mobile: this.user.mobile || '',
      roleId:
        this.user.roles && this.user.roles.length > 0
          ? this.user.roles[0].id
          : '',
    });
  }

  submit(): void {
    if (this.form.invalid || !this.currentUser?.b2bUnitId) {
      this.form.markAllAsTouched();
      this.errorMessage = !this.currentUser?.b2bUnitId
        ? 'User context is missing. Please re-login.'
        : 'Please fill all required fields correctly.';
      this.triggerShake();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const v = this.form.value;

    const payload: CreateUserPayload = {
      b2bUnitId: this.currentUser.b2bUnitId!,
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      email: v.email.trim(),
      mobile: v.mobile.trim(),
      roleIds: [v.roleId],
    };

    const request$ = this.isEditMode
      ? this.usersService.updateUser(this.user!.id, payload)
      : this.usersService.createUser(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ||
          (this.isEditMode
            ? 'Failed to update user.'
            : 'Failed to create user.') + ' Please try again.';
        this.triggerShake();
      },
    });
  }

  private triggerShake(): void {
    this.showShake = false;
    setTimeout(() => {
      this.showShake = true;
      setTimeout(() => (this.showShake = false), 300);
    }, 0);
  }
}
