import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../../project/services/project.service';

@Injectable({ providedIn: 'root' })
export class IncidentsContextService {
  private readonly selectedProjectSubject = new BehaviorSubject<Project | null>(null);

  readonly selectedProject$: Observable<Project | null> = this.selectedProjectSubject.asObservable();

  setSelectedProject(project: Project | null): void {
    this.selectedProjectSubject.next(project);
  }

  getSelectedProjectSnapshot(): Project | null {
    return this.selectedProjectSubject.getValue();
  }
}
