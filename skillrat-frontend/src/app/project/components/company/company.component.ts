import { Component, inject, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { CompanyResponse } from '../../Models/company-interface';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  showCompanyForm = false;
  companiesResponse : CompanyResponse | null = null;
  private readonly companyService = inject(CompanyService);

  ngOnInit(): void {
    this.getAllCompanies();
  }
  
  getAllCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (response: CompanyResponse) => {
        this.companiesResponse = response;
      },
      error: (err) => {
        console.error('Failed to load company', err);
      }
    });
  }
  openCompanyForm(): void {
    this.showCompanyForm = true;
  }

  onCompanyFormClosed(success: boolean): void {
    this.showCompanyForm = false;
    if (success) {
    }
  }
}
