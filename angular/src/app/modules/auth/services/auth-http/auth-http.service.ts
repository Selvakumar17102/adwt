import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { AuthModel } from '../../models/auth.model';

// Use direct API URL for server
const API_USERS_URL = 'http://localhost:3000/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // Login Method
  login(email: string, password: string): Observable<any> {
    //console.log('Attempting login with email:', email, password); // Log for debugging
    //console.log('API:', API_USERS_URL);
    return this.http.post(`${API_USERS_URL}/login`, { email, password });
  }

  // Create User
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Forgot Password
  forgotPassword(email: string): Observable<boolean> {
    //console.log('Checking forgot password for email:', email);
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, { email });
  }

  // Send OTP
  sendOtp(email: string): Observable<any> {
    //console.log('Sending OTP to email:', email);
    return this.http.post(`${API_USERS_URL}/send-otp`, { email });
  }

  // Verify OTP
  verifyOtp(email: string, otp: string): Observable<any> {
    //console.log('Verifying OTP for email:', email, 'OTP:', otp);
    return this.http.post(`${API_USERS_URL}/verify-otp`, { email, otp });
  }

  // Reset Password
  resetPassword(email: string, password: string): Observable<any> {
    //console.log('Resetting password for email:', email);
    return this.http.post(`${API_USERS_URL}/reset-password`, { email, newPassword: password });
  }

  // Get User By Token
  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_URL}/me`, { headers: httpHeaders });
  }
}
