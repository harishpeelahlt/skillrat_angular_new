import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
    selector: 'app-layout-component',
    templateUrl: './layout-component.component.html',
    styleUrl: './layout-component.component.css',
    animations: [
        trigger('dropdownAnimation', [
            transition(':enter', [
                style({ height: 0, opacity: 0 }),
                animate('200ms ease-out', style({ height: '*', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ height: '*', opacity: 1 }),
                animate('200ms ease-in', style({ height: 0, opacity: 0 }))
            ])
        ])
    ],
    standalone: false
})
export class LayoutComponentComponent {
  taOpen = false;
  usersOpen = false;

  toggleTA() {
    this.taOpen = !this.taOpen;
    if (this.usersOpen) this.usersOpen = false;
  }

  toggleUsers() {
    this.usersOpen = !this.usersOpen;
    if (this.taOpen) this.taOpen = false;
  }
}
