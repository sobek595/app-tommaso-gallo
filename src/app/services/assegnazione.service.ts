import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Assegnazione, AddAssegnazioneDTO, UpdateAssegnazioneDTO } from '../entities/Assegnazione';

@Injectable({
  providedIn: 'root'
})
export class AssegnazioneService {

  protected http = inject(HttpClient);

  list(filtri: { stato?: string; categoria?: string; corso?: string; dipendente?: string } = {}) {
    const query = Object.entries(filtri)
      .filter(([, v]) => v !== '' && v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&');
    const url = query ? `/api/assegnazioni-corsi?${query}` : '/api/assegnazioni-corsi';
    return this.http.get<Assegnazione[]>(url);
  }

  getById(id: string) {
    return this.http.get<Assegnazione>(`/api/assegnazioni-corsi/${id}`);
  }

  create(body: AddAssegnazioneDTO) {
    return this.http.post<Assegnazione>('/api/assegnazioni-corsi', body);
  }

  update(id: string, body: UpdateAssegnazioneDTO) {
    return this.http.put<Assegnazione>(`/api/assegnazioni-corsi/${id}`, body);
  }

  annulla(id: string) {
    return this.http.put<Assegnazione>(`/api/assegnazioni-corsi/${id}/annulla`, {});
  }

  completa(id: string) {
    return this.http.put<Assegnazione>(`/api/assegnazioni-corsi/${id}/completa`, {});
  }

  delete(id: string) {
    return this.http.delete(`/api/assegnazioni-corsi/${id}`);
  }
}
