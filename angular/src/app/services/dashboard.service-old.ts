import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://localhost:3000';

  private filterapiUrl = 'http://localhost:3000/filter-options';

  private backendUrl = 'http://localhost:3000';

  private apiUrl = 'http://localhost:3000/dashboard-data';

  private apiUrl1 = 'http://localhost:3000/getPTCases';

  private apiUrl2 = 'http://localhost:3000/getUICases';

  private apiUrl3 = 'http://localhost:3000/getCaseStatusCounts';

  private apiUrl4 = 'http://localhost:3000/getCaseStatus1Counts';

  private apiUrl5 = 'http://localhost:3000/chart-bar-data';

  private apiUrl6 = 'http://localhost:3000/chart-line-data';

  private apiUrl7 = 'http://localhost:3000/districtsmap';

  constructor(private http: HttpClient) {}


  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(this.filterapiUrl);
  }


  getDashboardCountData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCasesByYearRange(): Observable<any> {
    return this.http.get<any>(this.apiUrl1);
  }

  getCasesByMonthRange(): Observable<any> {
    return this.http.get<any>(this.apiUrl2);
  }

  getCaseStatusCounts(): Observable<any> {
    return this.http.get<any>(this.apiUrl3);
  }

  getCaseStatus1Counts(): Observable<any> {
    return this.http.get<any>(this.apiUrl4);
  }

  getBarChartData(): Observable<any> {
    return this.http.get<any>(this.apiUrl5);
  }

  getLineChartData(): Observable<any> {
    return this.http.get<any>(this.apiUrl6);
  }

  getDistricts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl7);
  }

  applyFilters(filters: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/apply-filters`, filters);
  }


}
