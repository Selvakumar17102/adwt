import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { environment } from '../../environments/environment'; // Import the environment

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `http://localhost:3000/apps/users_new`; // Use environment variable



  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, user);
  }

  // Update a user
  updateUser(userId: number, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}`, user);
  }

  // Delete a user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`);
  }

  // Toggle user status
  toggleUserStatus(userId: number, status: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/status`, status);
  }

  // Get all roles
  getAllRoles(): Observable<any> {
    return this.http.get(`http://localhost:3000/apps/roles`); // Use environment variable
  }
}
