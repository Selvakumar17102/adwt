import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdditionalReliefService {

  // private apiUrl = 'http://localhost:3000/fir-relief';
  private apiUrl = 'http://localhost:3000/fir-additional-relief';

  private baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}



  getFIRAdditionalReliefList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  getVictimsByFirId(firId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/victims?fir_id=${firId}`);
  }

  saveAdditionalRelief(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-additional-relief`, data);
  }

}

