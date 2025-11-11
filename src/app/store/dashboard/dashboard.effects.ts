import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardActions } from './dashboard.actions';
import { map, delay } from 'rxjs/operators';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);

  load$ = createEffect(() => this.actions$.pipe(
    ofType(DashboardActions.load),
    delay(400),
    map(() => DashboardActions.loaded({ students: 512, teachers: 42, classes: 36, exams: 12 }))
  ));
}
