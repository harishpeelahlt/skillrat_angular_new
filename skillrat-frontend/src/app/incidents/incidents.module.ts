import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { IncidentsLayoutComponent } from './components/incidents-layout/incidents-layout.component';
import { IncidentDashboardComponent } from './components/incident-dashboard/incident-dashboard.component';
import { IncidentFormComponent } from './components/incident-form/incident-form.component';
import { IncidentsRoutingModule } from './incidents-routing.module';
import { IncidentDetailsComponent } from './components/incident-details/incident-details.component';

@NgModule({
  declarations: [
    IncidentsLayoutComponent,
    IncidentDashboardComponent,
    IncidentFormComponent,
    IncidentDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    IncidentsRoutingModule
  ]
})
export class IncidentsModule { }
