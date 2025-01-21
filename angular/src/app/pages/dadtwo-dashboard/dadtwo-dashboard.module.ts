import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DadtwoDashboardComponent } from './dadtwo-dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DadtwoDashboardComponent],
  imports: [
    NgxChartsModule,
    CommonModule,
    FormsModule,
    NgCircleProgressModule.forRoot({
      radius: 60,
      outerStrokeWidth: 10,
      innerStrokeWidth: 0,
      outerStrokeColor: '#007bff',
      innerStrokeColor: '#eaeaea',
      animationDuration: 300,
    }),
    RouterModule.forChild([
      {
        path: '',
        component: DadtwoDashboardComponent,
      },
    ]),
    ModalsModule,
    WidgetsModule, // If you need widgets in the Dadtwo dashboard
  ],
})
export class DadtwoDashboardModule {}
