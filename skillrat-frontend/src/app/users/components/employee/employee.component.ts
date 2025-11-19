import { Component, OnInit } from '@angular/core';
import { EmployeesService, EmployeeDto, PageResponse } from '../../services/employees.service';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrl: './employee.component.css',
    standalone: false
})
export class EmployeeComponent implements OnInit {
  employees: EmployeeDto[] = [];
  isLoadingEmployees = false;
  employeesError: string | null = null;
   selectedEmployeeForEdit: any;

  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  searchQuery = '';

  showEmployeeForm = false;

  constructor(private employeesService: EmployeesService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  openEmployeeForm(): void {
    this.selectedEmployeeForEdit = null;
    this.showEmployeeForm = true;
  }

  onEmployeeFormClosed(success: boolean): void {
    this.showEmployeeForm = false;
     this.selectedEmployeeForEdit = null;
    if (success) {
      this.page = 0;
      this.loadEmployees();
    }
  }

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.page = 0;
    this.loadEmployees();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page += 1;
      this.loadEmployees();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page -= 1;
      this.loadEmployees();
    }
  }

  private loadEmployees(): void {
    this.isLoadingEmployees = true;
    this.employeesError = null;

    const qParam = this.searchQuery && this.searchQuery.trim().length > 0 ? this.searchQuery.trim() : undefined;

    this.employeesService.getEmployees(this.page, this.size, qParam).subscribe({
      next: (response: PageResponse<EmployeeDto>) => {
        this.employees = response.content || [];
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoadingEmployees = false;
      },
      error: () => {
        this.employeesError = 'Failed to load employees. Please try again.';
        this.employees = [];
        this.isLoadingEmployees = false;
      }
    });
  }

   onEditEmployee(employee: any): void {
    debugger
      this.selectedEmployeeForEdit = employee;     // Pass the employee to edit
      this.showEmployeeForm = true;
    }
    onDeleteEmployee(employee: any): void {}
}
