import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { CompanyOnboardPayload, CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
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
export class CompanyFormComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();

  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showShake = false;

  types = ['COMPANY', 'COLLEGE', 'SCHOOL', 'OTHER'];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['COMPANY', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required]],
      website: ['', [Validators.required]],
      groupName: ['', [Validators.required]],
      address: this.fb.group({
        line1: ['', [Validators.required]],
        line2: [''],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        postalCode: ['', [Validators.required]]
      })
    });
  }

  ngOnInit(): void {}

  close(success: boolean = false): void {
    this.closed.emit(success);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.triggerShake();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const value = this.form.value;
    const payload: CompanyOnboardPayload = {
      name: value.name,
      type: value.type,
      contactEmail: value.contactEmail,
      contactPhone: value.contactPhone,
      website: value.website,
      groupName: value.groupName,
      address: {
        line1: value.address.line1,
        line2: value.address.line2,
        city: value.address.city,
        state: value.address.state,
        country: value.address.country,
        postalCode: value.address.postalCode
      }
    };

    this.companyService.onboardCompany(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close(true);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to onboard company. Please try again.';
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
