import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { StatisticheService, StatisticaAcademy } from '../../services/statistiche.service';

@Component({
  selector: 'app-statistiche',
  standalone: false,
  templateUrl: './statistiche.component.html',
  styleUrl: './statistiche.component.css'
})
export class StatisticheComponent implements OnInit {
  private statisticheSrv = inject(StatisticheService);
  private fb = inject(FormBuilder);

  filterForm = this.fb.group({
    mese: [''],
    anno: [new Date().getFullYear().toString()],
    categoria: ['']
  });

  data: StatisticaAcademy[] = [];
  loading = false;
  error = '';

  months = [
    { value: '1', label: 'Gennaio' }, { value: '2', label: 'Febbraio' },
    { value: '3', label: 'Marzo' },   { value: '4', label: 'Aprile' },
    { value: '5', label: 'Maggio' },  { value: '6', label: 'Giugno' },
    { value: '7', label: 'Luglio' },  { value: '8', label: 'Agosto' },
    { value: '9', label: 'Settembre' },{ value: '10', label: 'Ottobre' },
    { value: '11', label: 'Novembre' },{ value: '12', label: 'Dicembre' }
  ];

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Assegnazioni e completamenti per mese/categoria' }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    const { mese, anno, categoria } = this.filterForm.value;
    const meseQuery = (mese && anno) ? `${anno}-${mese.padStart(2, '0')}` : '';
    this.statisticheSrv.getStatistiche({
      mese: meseQuery,
      categoria: categoria ?? ''
    }).subscribe({
      next: (res) => { this.data = res; this.buildChart(res); this.loading = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore nel caricamento delle statistiche.'; this.loading = false; }
    });
  }

  private buildChart(res: StatisticaAcademy[]): void {
    this.chartData = {
      labels: res.map(r => `${r.mese} — ${r.categoria}`),
      datasets: [
        {
          label: 'Assegnazioni',
          data: res.map(r => r.numeroAssegnazioni),
          backgroundColor: 'rgba(79, 70, 229, 0.7)'
        },
        {
          label: 'Completamenti',
          data: res.map(r => r.numeroCompletamenti),
          backgroundColor: 'rgba(25, 135, 84, 0.7)'
        }
      ]
    };
  }
}