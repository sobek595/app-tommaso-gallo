import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { AggregationResult, PermessionRequestService } from '../../services/permession-request.service';

@Component({
  selector: 'app-analitics',
  standalone: false,
  templateUrl: './analitics.component.html',
  styleUrl: './analitics.component.css'
})
export class AnaliticsComponent implements OnInit {
  private permessionSrv = inject(PermessionRequestService);
  private fb = inject(FormBuilder);

  filterForm = this.fb.group({
    month: [''],
    year: [new Date().getFullYear().toString()]
  });

  data: AggregationResult[] = [];
  loading = false;

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Giorni per dipendente' }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  months = [
    { value: '1', label: 'Gennaio' }, { value: '2', label: 'Febbraio' },
    { value: '3', label: 'Marzo' },   { value: '4', label: 'Aprile' },
    { value: '5', label: 'Maggio' },  { value: '6', label: 'Giugno' },
    { value: '7', label: 'Luglio' },  { value: '8', label: 'Agosto' },
    { value: '9', label: 'Settembre' },{ value: '10', label: 'Ottobre' },
    { value: '11', label: 'Novembre' },{ value: '12', label: 'Dicembre' }
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const { month, year } = this.filterForm.value;
    this.permessionSrv.getAggregato({ month: month ?? '', year: year ?? '' })
      .subscribe(res => {
        this.data = res;
        this.buildChart(res);
        this.loading = false;
      });
  }

  private buildChart(res: AggregationResult[]): void {
    this.chartData = {
      labels: res.map(r => `${r.dipendente.firstName} ${r.dipendente.lastName}`),
      datasets: [
        {
          label: 'Giorni richiesti',
          data: res.map(r => r.giorniRichiesti),
          backgroundColor: 'rgba(13, 110, 233, 0.7)'
        },
        {
          label: 'Giorni approvati',
          data: res.map(r => r.giorniApprovati),
          backgroundColor: 'rgba(25, 135, 84, 0.7)'
        }
      ]
    };
  }
}
