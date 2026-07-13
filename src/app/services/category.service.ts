import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  protected http = inject(HttpClient);
  categoryList(){
    return this.http.get<any[]>('/api/categorie');
  }
}
