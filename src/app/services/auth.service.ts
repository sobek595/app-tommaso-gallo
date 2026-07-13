import { inject, Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from 'rxjs';
import { User } from '../entities/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 protected http = inject(HttpClient);
  protected router = inject(Router);
  protected jwtSrv = inject(JwtService);
  protected _currentUser$ = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUser$.asObservable();
  isAuthenticated$ = this.currentUser$
                      .pipe(
                        map(user => !!user),
                        distinctUntilChanged(),
                        tap(isLoggedIn => console.log(isLoggedIn))
                      );
  
  login(email: string, password: string) {
    return this.http.post<any>('/api/users/login', { email, password }).pipe(
      tap((res) => this.jwtSrv.setToken(res.token)),
      tap((res) => this._currentUser$.next(res.user)),
      map((res) => res.user),
    )
  }

  constructor() { 
    const user = this.jwtSrv.getPayload<User>();
    this._currentUser$.next(user);
   }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  register(
    firstName: string,
    lastName: string,
    role: string,
    email: string,
    password: string
  ) {
    return this.http.post(`/api/users/register`, {firstName, lastName, role, email, password});
}
}
