import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponentComponent } from './layout-component/layout-component.component';


@NgModule({
  declarations: [
    LayoutComponentComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatIconModule
  ]
})
export class LayoutModule { }
