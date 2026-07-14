import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CorsoService } from '../../services/corso.service';
import { AuthService } from '../../services/auth.service';
import { Corso } from '../../entities/Corso';
import { CreateAssegnazioneModalComponent } from '../../components/create-assegnazione-modal/create-assegnazione-modal.component';

@Component({
  selector: 'app-dettaglio-corso',
  standalone: false,
  templateUrl: './dettaglio-corso.component.html',
  styleUrl: './dettaglio-corso.component.css'
})
export class DettaglioCorsoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private corsoSrv = inject(CorsoService);
  private authSrv = inject(AuthService);
  private fb = inject(FormBuilder);
  private modalSrv = inject(NgbModal);

  corso: Corso | null = null;
  loading = true;
  error = '';
  editMode = false;
  saving = false;
  deleting = false;
  confirmDelete = false;
  disattivando = false;

  editForm = this.fb.group({
    titolo: ['', [Validators.required, Validators.minLength(2)]],
    descrizione: [''],
    categoria: ['', Validators.required],
    durataOre: [1, [Validators.required, Validators.min(1)]],
    obbligatorio: [false],
    attivo: [true]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.corsoSrv.getById(id).subscribe({
      next: (data) => {
        this.corso = data;
        this.loading = false;
        this.patchForm(data);
      },
      error: () => { this.error = 'Corso non trovato.'; this.loading = false; }
    });
  }

  private patchForm(c: Corso) {
    this.editForm.patchValue({
      titolo: c.titolo,
      descrizione: c.descrizione,
      categoria: c.categoria,
      durataOre: c.durataOre,
      obbligatorio: c.obbligatorio,
      attivo: c.attivo
    });
  }

  goBack() {
    this.router.navigate(['/corsi']);
  }

  onEditToggle() {
    this.editMode = !this.editMode;
    this.error = '';
    if (this.editMode && this.corso) {
      this.patchForm(this.corso);
    }
  }

  onSave() {
    if (this.editForm.invalid || !this.corso?.id) return;
    this.saving = true;
    this.error = '';
    const v = this.editForm.value;
    const body = {
      titolo: v.titolo!,
      descrizione: v.descrizione ?? '',
      categoria: v.categoria!,
      durataOre: Number(v.durataOre),
      obbligatorio: !!v.obbligatorio,
      attivo: v.attivo !== false
    };
    this.corsoSrv.update(this.corso.id, body).subscribe({
      next: (updated) => { this.corso = updated; this.saving = false; this.editMode = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante il salvataggio.'; this.saving = false; }
    });
  }

  onDisattiva() {
    if (!this.corso?.id) return;
    this.disattivando = true;
    this.error = '';
    this.corsoSrv.disattiva(this.corso.id).subscribe({
      next: (updated) => { this.corso = updated; this.disattivando = false; },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante la disattivazione.'; this.disattivando = false; }
    });
  }

  onDeleteClick() {
    this.confirmDelete = true;
  }

  onDeleteCancel() {
    this.confirmDelete = false;
  }

  onDeleteConfirm() {
    if (!this.corso?.id) return;
    this.deleting = true;
    this.error = '';
    this.corsoSrv.delete(this.corso.id).subscribe({
      next: () => this.router.navigate(['/corsi']),
      error: (err) => {
        this.error = err.error?.message ?? 'Errore durante l\'eliminazione.';
        this.deleting = false;
        this.confirmDelete = false;
      }
    });
  }

  openAssegnaModal() {
    if (!this.corso) return;
    const ref = this.modalSrv.open(CreateAssegnazioneModalComponent, { centered: true, size: 'lg' });
    ref.componentInstance.corsoId = this.corso.id;
    ref.componentInstance.corsoTitolo = this.corso.titolo;
    ref.closed.subscribe(() => {
      // creata assegnazione, eventualmente ricarica per aggiornare stato
    });
  }
}
