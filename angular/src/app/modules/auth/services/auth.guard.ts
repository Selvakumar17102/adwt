import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = sessionStorage.getItem('user_data');

    // If user_data is missing, redirect to login
    if (!userData) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true; // Allow access if user_data exists
  }
}
