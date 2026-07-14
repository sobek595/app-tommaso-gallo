import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type StatisticaAcademy = {
  mese: string;
  categoria: string;
  numeroAssegnazioni: number;
  numeroCompletamenti: number;
  percentualeCompletamento: number;
};

@Injectable({
  providedIn: 'root'
})
export class StatisticheService {

  protected http = inject(HttpClient);

  getStatistiche(filtri: { mese?: string; categoria?: string; dipendente?: string } = {}) {
    const query = Object.entries(filtri)
      .filter(([, v]) => v !== '' && v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&');
    const url = query ? `/api/statistiche/academy?${query}` : '/api/statistiche/academy';
    return this.http.get<StatisticaAcademy[]>(url);
  }
}