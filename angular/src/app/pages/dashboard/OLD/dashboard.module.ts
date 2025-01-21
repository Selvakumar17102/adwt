import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    NgxChartsModule,
    CommonModule,
    FormsModule,
    NgCircleProgressModule.forRoot({
      radius: 60,
      outerStrokeWidth: 10,
      innerStrokeWidth: 0,
      outerStrokeColor: '#28a745',
      innerStrokeColor: '#eaeaea',
      animationDuration: 300,
    }),
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    ModalsModule,WidgetsModule
  ],
})
export class DashboardModule {}
