import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VmcMeetingService {
  private baseUrl = 'http://localhost:3000/vmcmeeting';

  constructor(private http: HttpClient) {}

  // Get districts and subdivisions
  getDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }

  // Get attendees for SDLVMC or DLVMC
  getAttendees(
    district: string,
    subdivision: string,
    committee: string,
    year: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('district', district)
      .set('subdivision', subdivision || '') // Allow empty subdivision for DLVMC
      .set('committee', committee)
      .set('year', year); // Include the selected year in the request
    //console.log(params);
    return this.http.get(`${this.baseUrl}/attendees`, { params });
  }
  

  // Get attendees for SLVMC
  getAttendeesStateLevel(): Observable<any> {
    const params = new HttpParams().set('committee', 'SLVMC');
    return this.http.get(`${this.baseUrl}/attendees`, { params });
  }

  // getMeetingStatuses(committee: string, year: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/statuses`, { params: { committee, year } });
  // }

  submitMeeting(meetingData: any): Observable<any> {
    const formData = new FormData();
  
    // Append meeting details
    formData.append("committee", meetingData.committee);
    formData.append("meeting", meetingData.meeting);
    formData.append("district", meetingData.district);
    if (meetingData.subdivision) {
      formData.append("subdivision", meetingData.subdivision); // Optional for SDLVMC
    }
    formData.append("meetingDate", meetingData.meetingDate);
    formData.append("meetingTime", meetingData.meetingTime);
  
    // Append attendees array as a single JSON string
    formData.append("attendees", JSON.stringify(meetingData.attendees));
  
    // Append the file
    if (meetingData.uploadedFile) {
      formData.append("uploadedFile", meetingData.uploadedFile);
    }
  
    // Post the FormData to the backend
    return this.http.post(`${this.baseUrl}/submit-meeting`, formData);
  }
  
}
