import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoliceStationsService {

  private baseUrl = 'http://localhost:3000/police-station';
  // private baseUrl = 'http://localhost:3000/police-station';

  constructor(private http: HttpClient) {}

  // Get all police Station
  getAllPoliceStations(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get all districts for dropdown selection
  getAllStations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }

  // Add a new police station
  addPoliceStation(station: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, station);
  }

  // Update a police Station
  updatePoliceStation(id: number, station: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, station);
  }

  // Delete a police Station
  deletePoliceStation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
