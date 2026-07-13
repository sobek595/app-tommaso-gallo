import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PermissionRequest } from '../entities/PermesionRequest';

@Injectable({
  providedIn: 'root'
})
export class PermessionRequestService {

  protected http = inject(HttpClient);

  permissionList() {
    return this.http.get<PermissionRequest[]>('/api/permessi');
  }

  pendingList() {
    return this.http.get<PermissionRequest[]>('/api/permessi/da-approvare');
  }

  create(body: { categoryDescription: string; dateStart: string; dateEnd: string; motivation: string }) {
    return this.http.post<PermissionRequest>('/api/permessi', body);
  }

  getById(id: string) {
    return this.http.get<PermissionRequest>(`/api/permessi/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`/api/permessi/${id}`);
  }

  update(id: string, body: { categoryDescription: string; dateStart: string; dateEnd: string; motivation: string }) {
    return this.http.put<PermissionRequest>(`/api/permessi/${id}`, body);
  }

  approve(id: string) {
    return this.http.put<PermissionRequest>(`/api/permessi/${id}/approve`, {});
  }

  reject(id: string) {
    return this.http.put<PermissionRequest>(`/api/permessi/${id}/reject`, {});
  }

  getAggregato(params: { month?: string; year?: string } = {}) {
    const query = Object.entries(params)
      .filter(([, v]) => v !== '' && v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    const url = query ? `/api/permessi/aggregato?${query}` : '/api/permessi/aggregato';
    return this.http.get<AggregationResult[]>(url);
  }
}

export type AggregationResult = {
  dipendente: { firstName: string; lastName: string; id: string };
  giorniRichiesti: number;
  giorniApprovati: number;
};
