import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  protected storageKey = 'authToken';

  hasToken() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  setToken(value: string) {
    localStorage.setItem(this.storageKey, value);
  }

  removeToken() {
    localStorage.removeItem(this.storageKey);
  }

  getPayload<User>(){
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return jwtDecode<User>(token);
  }
}