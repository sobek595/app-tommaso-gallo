import { inject, Injectable } from '@angular/core';
import { User } from '../entities/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  protected http = inject(HttpClient);
  listUsers(){
    return this.http.get<User[]>('/api/users');
  }
}
