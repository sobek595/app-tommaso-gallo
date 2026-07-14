import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CorsoService } from '../../services/corso.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/User';
import { Corso } from '../../entities/Corso';
import { CreateCorsoModalComponent } from '../../components/create-corso-modal/create-corso-modal.component';

@Component({
  selector: 'app-catalogo-corsi',
  standalone: false,
  templateUrl: './catalogo-corsi.component.html',
  styleUrl: './catalogo-corsi.component.css'
})
export class CatalogoCorsiComponent implements OnInit {
  private corsoSrv = inject(CorsoService);
  private modalSrv = inject(NgbModal);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected authSrv = inject(AuthService);

  currentUser: User | null = null;
  corsi: Corso[] = [];
  loading = false;
  error = '';

  filtri = this.fb.group({
    categoria: [''],
    attivo: ['']
  });

  ngOnInit() {
    this.authSrv.currentUser$.subscribe(u => this.currentUser = u);
    this.carica();
  }

  carica() {
    this.loading = true;
    this.error = '';
    const v = this.filtri.value;
    this.corsoSrv.list({ categoria: v.categoria ?? '', attivo: v.attivo ?? '' }).subscribe({
      next: (data) => { this.corsi = data; this.loading = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore nel caricamento dei corsi.'; this.loading = false; }
    });
  }

  applicaFiltri() {
    this.carica();
  }

  resetFiltri() {
    this.filtri.reset({ categoria: '', attivo: '' });
    this.carica();
  }

  openCreateModal() {
    const ref = this.modalSrv.open(CreateCorsoModalComponent, { centered: true, size: 'lg' });
    ref.closed.subscribe(() => this.carica());
  }

  vaiADettaglio(c: Corso) {
    this.router.navigate(['/corsi', c.id]);
  }
}
