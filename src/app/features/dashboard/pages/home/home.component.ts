import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectWelcomeName, selectStats } from '../../../../store/dashboard/dashboard.selectors';
import { RootState } from '../../../../store';
import { DashboardActions } from '../../../../store/dashboard/dashboard.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private store = inject<Store<RootState>>(Store as any);
  name: Signal<string> = this.store.selectSignal(selectWelcomeName);
  stats: Signal<{ students: number; teachers: number; classes: number; exams: number }> = this.store.selectSignal(selectStats);

  constructor() {
    this.store.dispatch(DashboardActions.load());
  }
}
