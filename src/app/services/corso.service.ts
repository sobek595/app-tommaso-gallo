import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Corso, AddCorsoDTO, UpdateCorsoDTO } from '../entities/Corso';

@Injectable({
  providedIn: 'root'
})
export class CorsoService {

  protected http = inject(HttpClient);

  list(filtri: { categoria?: string; attivo?: string } = {}) {
    const query = Object.entries(filtri)
      .filter(([, v]) => v !== '' && v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&');
    const url = query ? `/api/corsi?${query}` : '/api/corsi';
    return this.http.get<Corso[]>(url);
  }

  getById(id: string) {
    return this.http.get<Corso>(`/api/corsi/${id}`);
  }

  create(body: AddCorsoDTO) {
    return this.http.post<Corso>('/api/corsi', body);
  }

  update(id: string, body: UpdateCorsoDTO) {
    return this.http.put<Corso>(`/api/corsi/${id}`, body);
  }

  disattiva(id: string) {
    return this.http.put<Corso>(`/api/corsi/${id}/disattiva`, {});
  }

  delete(id: string) {
    return this.http.delete(`/api/corsi/${id}`);
  }
}
