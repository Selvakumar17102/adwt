import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirService {
  getVictimDetailsByFirId(firId: string) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://localhost:3000/fir'; // Adjust this to your actual API base URL

  constructor(private http: HttpClient) {}

  // Get user details by user ID
  getUserDetails(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user-details`, { userId });
  }



  // Get police division details by district
  getPoliceDivision(district: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/police-division?district=${district}`);
  }

  // Get offence options
  getOffences(): Observable<any> {
    //console.log("Requesting FIR list from backend");
    return this.http.get(`${this.baseUrl}/offences`);
  }

  // Get offence acts
 getOffenceActs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/offence-acts`);
  }

  getPoliceRevenue(): Observable<any> {
    return this.http.get(`${this.baseUrl}/police-revenue`);
  }

  // Get SC/ST sections
  getCastes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/scst-sections`);
  }




 // Step 1 handling in service
handleStepOne(firId: string | null, firData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/handle-step-one`, { firId, firData });
}

  // Method to handle step 2
  handleStepTwo(firId: string | null, firData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/handle-Step-Two`, { firId, firData });
  }


  // Save Step 3 as Draft
saveStepThreeAsDraft(firData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/handle-step-three`, firData);
}

saveStepFourAsDraft(firData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/handle-step-four`, firData);
}


  // Save Step 5 as draft
  saveStepFiveAsDraft(firData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/handle-step-five`, firData);
  }




  saveStepSixAsDraft(firData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-step-six`, firData);
  }

  updateFirStatus(firId: string, status: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-status`, { firId, status });
  }

  getVictimsReliefDetails(firId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/victims-details/${firId}`);
  }




  getFirDetails(firId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/details`, {
      params: { fir_id: firId },
    });
  }

  saveReliefDetails(reliefData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/victims-details`, reliefData);
  }


  // updateFirStatus_1(firId: string, status: number): Observable<any> {
  //   const url = `${this.baseUrl}/update-fir-status_1/${firId}`;
  //   return this.http.post(url, { status });
  // }


  updateFirStatus_1(firId: string, status: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-status_1`, { firId, status });
  }


  getFirStatus(firId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/status/${firId}`);
  }


}
