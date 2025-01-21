import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdditionalReliefService {

  private apiUrl = 'http://localhost:3000/fir-additional-relief';
  //private apiUrl = 'http://localhost:3000/fir-additional-relief';

  constructor(private http: HttpClient) {}

  getFIRAdditionalReliefList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  getVictimsByFirId(firId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/victims?fir_id=${firId}`);
  }

}

