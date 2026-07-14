import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssegnazioneService } from '../../services/assegnazione.service';
import { CorsoService } from '../../services/corso.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Assegnazione, StatoAssegnazione } from '../../entities/Assegnazione';
import { Corso } from '../../entities/Corso';
import { User, UserRole } from '../../entities/User';
import { CreateAssegnazioneModalComponent } from '../../components/create-assegnazione-modal/create-assegnazione-modal.component';

@Component({
  selector: 'app-dettaglio-assegnazione',
  standalone: false,
  templateUrl: './dettaglio-assegnazione.component.html',
  styleUrl: './dettaglio-assegnazione.component.css'
})
export class DettaglioAssegnazioneComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private assegnazioneSrv = inject(AssegnazioneService);
  private corsoSrv = inject(CorsoService);
  private userSrv = inject(UserService);
  private authSrv = inject(AuthService);
  private fb = inject(FormBuilder);
  private modalSrv = inject(NgbModal);

  assegnazione: Assegnazione | null = null;
  currentUser: User | null = null;
  StatoAssegnazione = StatoAssegnazione;
  corsi: Corso[] = [];
  dipendenti: User[] = [];
  loading = true;
  error = '';
  editMode = false;
  saving = false;
  annullando = false;
  confirmAnnulla = false;
  completando = false;

  editForm = this.fb.group({
    corsoId: ['', Validators.required],
    dipendenteId: ['', Validators.required],
    dataAssegnazione: ['', Validators.required],
    dataScadenza: ['', Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.authSrv.currentUser$.subscribe(u => this.currentUser = u);
    this.corsoSrv.list({ attivo: 'true' }).subscribe(data => this.corsi = data);
    this.userSrv.listUsers().subscribe(users => this.dipendenti = users.filter(u => u.role === UserRole.DIPENDENTE));
    this.assegnazioneSrv.getById(id).subscribe({
      next: (data) => { this.assegnazione = data; this.loading = false; this.patchForm(data); },
      error: () => { this.error = 'Assegnazione non trovata.'; this.loading = false; }
    });
  }

  private toInputDate(d: string | null): string {
    if (!d) return '';
    return new Date(d).toISOString().substring(0, 10);
  }

  private patchForm(a: Assegnazione) {
    this.editForm.patchValue({
      corsoId: a.corsoId.id,
      dipendenteId: a.dipendenteId.id,
      dataAssegnazione: this.toInputDate(a.dataAssegnazione),
      dataScadenza: this.toInputDate(a.dataScadenza)
    });
  }

  get statoLabel(): string {
    switch (this.assegnazione?.stato) {
      case StatoAssegnazione.ASSEGNATO:   return 'Assegnato';
      case StatoAssegnazione.COMPLETATO:  return 'Completato';
      case StatoAssegnazione.SCADUTO:     return 'Scaduto';
      case StatoAssegnazione.ANNULLATO:   return 'Annullato';
      default:                             return this.assegnazione?.stato ?? '';
    }
  }

  get statoClass(): string {
    switch (this.assegnazione?.stato) {
      case StatoAssegnazione.ASSEGNATO:   return 'text-bg-primary';
      case StatoAssegnazione.COMPLETATO:  return 'text-bg-success';
      case StatoAssegnazione.SCADUTO:     return 'text-bg-warning';
      case StatoAssegnazione.ANNULLATO:   return 'text-bg-danger';
      default:                             return 'text-bg-secondary';
    }
  }

  goBack() {
    this.router.navigate(['/homepage']);
  }

  onEditToggle() {
    this.editMode = !this.editMode;
    this.error = '';
    if (this.editMode && this.assegnazione) {
      this.patchForm(this.assegnazione);
    }
  }

  onSave() {
    if (this.editForm.invalid || !this.assegnazione?.id) return;
    this.saving = true;
    this.error = '';
    const v = this.editForm.value;
    this.assegnazioneSrv.update(this.assegnazione.id, {
      corsoId: v.corsoId!,
      dipendenteId: v.dipendenteId!,
      dataAssegnazione: v.dataAssegnazione!,
      dataScadenza: v.dataScadenza!
    }).subscribe({
      next: (updated) => { this.assegnazione = updated; this.saving = false; this.editMode = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante il salvataggio.'; this.saving = false; }
    });
  }

  onAnnullaClick() {
    this.confirmAnnulla = true;
  }

  onAnnullaCancel() {
    this.confirmAnnulla = false;
  }

  onAnnullaConfirm() {
    if (!this.assegnazione?.id) return;
    this.annullando = true;
    this.error = '';
    this.assegnazioneSrv.annulla(this.assegnazione.id).subscribe({
      next: (updated) => { this.assegnazione = updated; this.annullando = false; this.confirmAnnulla = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante l\'annullamento.'; this.annullando = false; this.confirmAnnulla = false; }
    });
  }

  onCompleta() {
    if (!this.assegnazione?.id) return;
    this.completando = true;
    this.error = '';
    this.assegnazioneSrv.completa(this.assegnazione.id).subscribe({
      next: (updated) => { this.assegnazione = updated; this.completando = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante il completamento.'; this.completando = false; }
    });
  }
}
