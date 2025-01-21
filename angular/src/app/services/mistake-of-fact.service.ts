import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MistakeOfFactService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  // Add officer details
  addOfficers(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/mistake-of-fact`, data);
  }


}
