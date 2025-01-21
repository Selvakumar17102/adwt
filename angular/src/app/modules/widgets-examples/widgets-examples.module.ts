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
import { PoliceStationsComponent } from './police-stations/police-stations.component';
import { CourtComponent } from './court/court.component';

//import { NgxPaginationModule } from 'ngx-pagination';

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
import { VmcmeetingComponent  } from './vmcmeeting/vmcmeeting.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { VmcComponent  } from './vmc/vmc.component';

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
    PoliceStationsComponent,
    CourtComponent,
    RevenueDistrictComponent,
    OffenceComponent,
    OffenceActScStComponent,
    DistrictComponent,
    CityComponent,
    CasteAndCommunityComponent,
    FirListComponent,
    VmcComponent,
    VmcmeetingComponent,
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
    SweetAlert2Module,
  ],
})
export class WidgetsExamplesModule {}
