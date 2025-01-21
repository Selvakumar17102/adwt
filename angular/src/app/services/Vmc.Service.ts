import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Vmcservice {
  private baseUrl = 'http://localhost:3000/vmc';
  //private baseUrl1 = 'http://localhost:3000/vmcadd';

  constructor(private http: HttpClient) {}

  getAllMembers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  addMember(memberData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, memberData);
  }

  updateMember(memberId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${memberId}`, updatedData);
  }
  deleteMember(memberId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${memberId}`);
  }




  toggleMemberStatus(memberId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${memberId}/toggle-status`, { status });
  }



  getAllDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }
  getSubdivisionsByDistrict(district: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subdivisions?district=${district}`);
  }
  
  // getSubdivisionsByDistrict(district: string): Observable<any[]> {
  //   return this.http.get<any[]>(`/api/subdivisions?district=${district}`);
  // }




}

