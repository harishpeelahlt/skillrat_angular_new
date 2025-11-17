import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { ProjectRoutingModule } from './Project-routing.module';
import { ProjectFormComponent } from './components/projects/project-form/project-form.component';
import { CompanyComponent } from './components/company/company.component';
import { RouterModule } from '@angular/router';
import { CompanyFormComponent } from './components/company/company-form/company-form.component';
import { ProjectsComponent } from './components/projects/projects.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectFormComponent,
    CompanyComponent,
    CompanyFormComponent,
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    ProjectRoutingModule,
    RouterModule
  ]
})
export class ProjectModule { }
