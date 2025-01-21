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
  private baseUrl = 'http://localhost:3000/fir';
  // Adjust this to your actual API base URL

  constructor(private http: HttpClient) {}



  // Get user details by user ID
  getUserDetails(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user-details`, { userId });
  }


  getPoliceStations(district: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/police-stations?district=${district}`);
  }



  // Get police division details by district
  getPoliceDivision(district: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/police-division?district=${district}`);
  }

  getPoliceDivisionedit(): Observable<any> {
    return this.http.get(`${this.baseUrl}/police-divisionedit`);
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
  // getCastes(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/scst-sections`);
  // }


  getAllAccusedCommunities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/accused-communities`);
  }

  getAccusedCastesByCommunity(community: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/accused-castes-by-community?community=${community}`);
  }

  getCourtDivisions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/court-divisions`);
  }

  getCourtRangesByDivision(division: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/court-ranges?division=${division}`);
  }

  getDistricts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/districts`);
  }


  getAllCommunities(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/fir/communities');
  }

  getCastesByCommunity(community: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/castes-by-community?community=${community}`);
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


saveStepFiveAsDraft(firData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/handle-step-five`, firData);
}




  saveStepSixAsDraft(firData: any): Observable<any> {

    return this.http.post(`${this.baseUrl}/save-step-six`, firData);
  }

  saveStepSevenAsDraft(firData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-step-seven`, firData);
  }

  editStepSevenAsDraft(firData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-step-sevenedit`, firData);
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


  removeAttachmentFromBackend(attachmentIdToDelete: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/remove-chargesheet-image?id=${attachmentIdToDelete}`); 
  }
  removeAttachmentFromBackend1(attachmentIdToDelete: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/remove-chargesheet-relief?id=${attachmentIdToDelete}`); 
  }

  // Get SC/ST sections
  getCastes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/scst-sections`);
  }

}
