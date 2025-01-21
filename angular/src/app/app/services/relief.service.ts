import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReliefService {
  private apiUrl = 'http://localhost:3000/fir-relief'; // Base URL

  constructor(private http: HttpClient) {}

  // Fetch FIR Relief List
  getFIRReliefList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Save First Installment Details
  saveFirstInstallmentDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-first-installment`, data);
  }
  saveSecondInstallmentDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-second-installment`, data);
  }


  getVictimsReliefDetails_1(firId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/victims-details_1/${firId}`);
  }

  getSecondInstallmentDetails(firId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/second-installment/${firId}`);
  }


}

