import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssegnazioneService } from '../../services/assegnazione.service';
import { CorsoService } from '../../services/corso.service';
import { UserService } from '../../services/user.service';
import { Corso } from '../../entities/Corso';
import { User, UserRole } from '../../entities/User';

@Component({
  selector: 'app-create-assegnazione-modal',
  standalone: false,
  templateUrl: './create-assegnazione-modal.component.html',
  styleUrl: './create-assegnazione-modal.component.css'
})
export class CreateAssegnazioneModalComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private assegnazioneSrv = inject(AssegnazioneService);
  private corsoSrv = inject(CorsoService);
  private userSrv = inject(UserService);
  private fb = inject(FormBuilder);

  @Input() corsoId?: string;
  @Input() corsoTitolo?: string;

  corsi: Corso[] = [];
  dipendenti: User[] = [];
  saving = false;
  error = '';

  form = this.fb.group({
    corsoId: [null as string | null, Validators.required],
    dipendenteId: ['', Validators.required],
    dataAssegnazione: ['', Validators.required],
    dataScadenza: ['', Validators.required]
  });

  ngOnInit() {
    this.corsoSrv.list({ attivo: 'true' }).subscribe(data => {
      this.corsi = data;
      if (this.corsoId) {
        this.form.patchValue({ corsoId: this.corsoId });
      }
    });
    this.userSrv.listUsers().subscribe(users => {
      this.dipendenti = users.filter(u => u.role === UserRole.DIPENDENTE);
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const v = this.form.value;
    this.assegnazioneSrv.create({
      corsoId: v.corsoId!,
      dipendenteId: v.dipendenteId!,
      dataAssegnazione: v.dataAssegnazione!,
      dataScadenza: v.dataScadenza!
    }).subscribe({
      next: (created) => { this.saving = false; this.activeModal.close(created); },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante la creazione.'; this.saving = false; }
    });
  }
}
