import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CorsoService } from '../../services/corso.service';
import { AddCorsoDTO } from '../../entities/Corso';

@Component({
  selector: 'app-create-corso-modal',
  standalone: false,
  templateUrl: './create-corso-modal.component.html',
  styleUrl: './create-corso-modal.component.css'
})
export class CreateCorsoModalComponent {
  activeModal = inject(NgbActiveModal);
  private corsoSrv = inject(CorsoService);
  private fb = inject(FormBuilder);

  saving = false;
  error = '';

  form = this.fb.group({
    titolo: ['', [Validators.required, Validators.minLength(2)]],
    descrizione: [''],
    categoria: ['', Validators.required],
    durataOre: [1, [Validators.required, Validators.min(1)]],
    obbligatorio: [false],
    attivo: [true]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const v = this.form.value;
    const body: AddCorsoDTO = {
      titolo: v.titolo!,
      descrizione: v.descrizione ?? '',
      categoria: v.categoria!,
      durataOre: Number(v.durataOre),
      obbligatorio: !!v.obbligatorio,
      attivo: v.attivo !== false
    };
    this.corsoSrv.create(body).subscribe({
      next: (created) => { this.saving = false; this.activeModal.close(created); },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante la creazione.'; this.saving = false; }
    });
  }
}
