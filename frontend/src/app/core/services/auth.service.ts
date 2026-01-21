import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(user: string, pass: string): boolean {
    // Simulação de login (Basic Auth hardcoded no interceptor é admin:admin)
    if (user === 'admin' && pass === 'admin') {
      localStorage.setItem('auth_token', btoa(`${user}:${pass}`));
      this.loggedIn.next(true);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
