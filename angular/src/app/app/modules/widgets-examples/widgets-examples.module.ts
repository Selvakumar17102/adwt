// widgets-examples.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsExamplesRoutingModule } from './widgets-examples-routing.module';
import { WidgetsExamplesComponent } from './widgets-examples.component';
import { ListsComponent } from './lists/lists.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChartsComponent } from './charts/charts.component';
import { MixedComponent } from './mixed/mixed.component';
import { TablesComponent } from './tables/tables.component';
import { FeedsComponent } from './feeds/feeds.component';
import { WidgetsModule } from '../../_metronic/partials';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoliceDistrictComponent } from './police-district/police-district.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LayoutModule } from 'src/app/_metronic/layout/layout.module';
import { RevenueDistrictComponent } from './revenue-district/revenue-district.component';
import { OffenceComponent } from './offence/offence.component';
import { OffenceActScStComponent } from './offence-act-scst/offence-act-scst.component';
import { DistrictComponent } from './district/district.component';
import { CityComponent } from './city/city.component';
import { CasteAndCommunityComponent } from './caste-and-community/caste-and-community.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FirListComponent } from './fir-list/fir-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgGridModule } from 'ag-grid-angular';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [
    WidgetsExamplesComponent,
    ListsComponent,
    StatisticsComponent,
    ChartsComponent,
    MixedComponent,
    TablesComponent,
    FeedsComponent,
    PoliceDistrictComponent,
    RevenueDistrictComponent,
    OffenceComponent,
    OffenceActScStComponent,
    DistrictComponent,
    CityComponent,
    CasteAndCommunityComponent,
    FirListComponent
    // Remove AddFirComponent from here
  ],
  imports: [
    CommonModule,
    WidgetsExamplesRoutingModule,
    WidgetsModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbDropdownModule, DragDropModule,
    MatFormFieldModule, // Add Material Modules
    MatSelectModule,
    MatCheckboxModule,
    MatOptionModule,
    LayoutModule,
  ],
})
export class WidgetsExamplesModule {}
