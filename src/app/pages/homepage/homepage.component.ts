import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssegnazioneService } from '../../services/assegnazione.service';
import { CorsoService } from '../../services/corso.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../entities/User';
import { Corso } from '../../entities/Corso';
import { Assegnazione, StatoAssegnazione } from '../../entities/Assegnazione';
import { CreateAssegnazioneModalComponent } from '../../components/create-assegnazione-modal/create-assegnazione-modal.component';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  private assegnazioneSrv = inject(AssegnazioneService);
  private corsoSrv = inject(CorsoService);
  private userSrv = inject(UserService);
  private modalSrv = inject(NgbModal);
  private fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);

  currentUser: User | null = null;
  assegnazioneList: Assegnazione[] = [];
  corsi: Corso[] = [];
  dipendenti: User[] = [];
  loading = false;
  error = '';

  StatoAssegnazione = StatoAssegnazione;

  filtri = this.fb.group({
    stato: [''],
    categoria: [''],
    corso: [''],
    dipendente: ['']
  });

  constructor() {
    this.authSrv.currentUser$.subscribe(u => {
      this.currentUser = u;
      this.caricaFiltri();
      this.carica();
    });
  }

  private caricaFiltri() {
    this.corsoSrv.list().subscribe(data => this.corsi = data);
    const isReferente = this.currentUser?.role === UserRole.REFERENTE;
    if (isReferente) {
      this.userSrv.listUsers().subscribe(users => this.dipendenti = users.filter(d => d.role === UserRole.DIPENDENTE));
    }
  }

  get isReferente(): boolean {
    return this.currentUser?.role === UserRole.REFERENTE;
  }

  carica() {
    this.loading = true;
    this.error = '';
    const v = this.filtri.value;
    this.assegnazioneSrv.list({
      stato: v.stato ?? '',
      categoria: v.categoria ?? '',
      corso: v.corso ?? '',
      dipendente: v.dipendente ?? ''
    }).subscribe({
      next: (data) => { this.assegnazioneList = data; this.loading = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore nel caricamento.'; this.loading = false; }
    });
  }

  applicaFiltri() {
    this.carica();
  }

  resetFiltri() {
    this.filtri.reset({ stato: '', categoria: '', corso: '', dipendente: '' });
    this.carica();
  }

  openCreateModal() {
    const ref = this.modalSrv.open(CreateAssegnazioneModalComponent, { centered: true, size: 'lg' });
    ref.closed.subscribe(() => this.carica());
  }

  onCompleta(a: Assegnazione) {
    if (!a?.id) return;
    this.assegnazioneSrv.completa(a.id).subscribe({
      next: () => this.carica(),
      error: (err) => { this.error = err.error?.message ?? 'Errore durante il completamento.'; }
    });
  }
}
