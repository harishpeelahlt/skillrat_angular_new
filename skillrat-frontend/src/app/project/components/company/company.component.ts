import { Component } from '@angular/core';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrl: './company.component.css',
    standalone: false
})
export class CompanyComponent {
  showCompanyForm = false;

  openCompanyForm(): void {
    this.showCompanyForm = true;
  }

  onCompanyFormClosed(success: boolean): void {
    this.showCompanyForm = false;
    if (success) {
      // Optionally refresh company list here later
    }
  }
}
