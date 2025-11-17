import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentsLayoutComponent } from './components/incidents-layout/incidents-layout.component';
import { IncidentDashboardComponent } from './components/incident-dashboard/incident-dashboard.component';
import { IncidentDetailsComponent } from './components/incident-details/incident-details.component';

const routes: Routes = [
  {
    path: '',
    component: IncidentsLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: IncidentDashboardComponent
      },
      {
        path: 'incident',
        component: IncidentDashboardComponent
      },
      {
        path: 'add-incident',
        component: IncidentDashboardComponent
      },
      {
        path: 'assigned-to-me',
        component: IncidentDashboardComponent
      },
      {
        path: 'open',
        component: IncidentDashboardComponent
      },
      {
        path: 'all-incidents',
        component: IncidentDashboardComponent
      },
      {
        path: 'details/:id',
        component: IncidentDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentsRoutingModule { }
