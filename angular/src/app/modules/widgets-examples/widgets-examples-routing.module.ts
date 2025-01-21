import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { FeedsComponent } from './feeds/feeds.component';
import { ListsComponent } from './lists/lists.component';
import { MixedComponent } from './mixed/mixed.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TablesComponent } from './tables/tables.component';
import { WidgetsExamplesComponent } from './widgets-examples.component';
import { PoliceDistrictComponent } from './police-district/police-district.component'; // Ensure this is the correct path
import { LayoutComponent } from 'src/app/_metronic/layout/layout.component'; // <-- Adjust this path to match your project structure
import { OffenceComponent } from './offence/offence.component';
import { OffenceActScStComponent } from './offence-act-scst/offence-act-scst.component';
import { DistrictComponent } from './district/district.component';
import { RevenueDistrictComponent } from './revenue-district/revenue-district.component';
import { CityComponent } from './city/city.component';
import { CasteAndCommunityComponent } from './caste-and-community/caste-and-community.component';
import { FirListComponent } from './fir-list/fir-list.component';
import { MistakeOfFactComponent } from './mistake-of-fact/mistake-of-fact.component';
import { ReliefComponent } from './relief/relief.component';
import { ReliefListComponent } from './relief-list/relief-list.component';
import { EditFirComponent } from './edit-fir/edit-fir.component';
import { AlteredCaseComponent } from './altered-case/altered-case.component';
import { AdditionalReliefComponent } from './additional-relief/additional-relief.component';
import { AdditionalReliefListComponent } from './additional-relief-list/additional-relief-list.component';

import { PoliceStationsComponent } from './police-stations/police-stations.component';
import { CourtComponent } from './court/court.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { MonetaryReliefComponent } from './Monetary-relief/Monetary-relief.component';
import { AdditionalReliefReportComponent } from './additional-relief-report/additional-relief-report.component';

import { VmcComponent  } from './vmc/vmc.component';
import { VmcmeetingComponent  } from './vmcmeeting/vmcmeeting.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'lists',
        component: ListsComponent,
      },
      {
        path: 'police-district',
        component: PoliceDistrictComponent,
      },
      {
        path: 'police-stations',
        component: PoliceStationsComponent,
      },
      {
        path: 'court',
        component: CourtComponent,
      },

      {
        path: 'revenue-district',
        component: RevenueDistrictComponent,
      },

       {
        path: 'offence',
        component: OffenceComponent,
      },
      { 
        path: 'mistake-of-fact',
        component: MistakeOfFactComponent 
      },
      { 
        path: 'edit-fir', 
        component: EditFirComponent 
      },
      { 
        path: 'altered-case', 
        component: AlteredCaseComponent 
      },
      { 
        path: 'monthly-report', 
        component: MonthlyReportComponent 
      },
      { 
        path: 'Monetary-relief', 
        component: MonetaryReliefComponent 
      },
      { 
        path: 'additional-relief-report', 
        component: AdditionalReliefReportComponent 
      },
      {
        path: 'offence-act-scst',
        component: OffenceActScStComponent,
      },
      {
        path: 'district',
        component: DistrictComponent,
      }, 
      { 
        path: 'relief', 
        component: ReliefComponent 
      },
      { 
        path: 'vmc', 
        component: VmcComponent 
      },

{path:'VmcmeetingComponent',component: VmcmeetingComponent },

{ path: 'relief-list',component: ReliefListComponent},

{ path: 'additional-relief',component: AdditionalReliefComponent},
{ path: 'additional-relief-list',component: AdditionalReliefListComponent},

{ path: 'city', component: CityComponent },
  { path: 'caste-and-community', component: CasteAndCommunityComponent },{ path: 'fir-list', component: FirListComponent },{
        path: 'add-fir',
        data: { title: 'Home Page' },
        loadComponent: () =>
          import('./add-fir/add-fir.component').then(m => m.AddFirComponent),


          },

      {
        path: 'statistics',
        component: StatisticsComponent,
      },
      {
        path: 'charts',
        component: ChartsComponent,
      },
      {
        path: 'mixed',
        component: MixedComponent,
      },
      {
        path: 'tables',
        component: TablesComponent,
      },
      {
        path: 'feeds',
        component: FeedsComponent,
      },
      { path: '', redirectTo: 'lists', pathMatch: 'full' },
      { path: '**', redirectTo: 'lists', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WidgetsExamplesRoutingModule {}
