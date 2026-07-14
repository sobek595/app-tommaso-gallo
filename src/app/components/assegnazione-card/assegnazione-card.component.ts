import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Assegnazione, StatoAssegnazione } from '../../entities/Assegnazione';
import { User } from '../../entities/User';

@Component({
  selector: 'app-assegnazione-card',
  standalone: false,
  templateUrl: './assegnazione-card.component.html',
  styleUrl: './assegnazione-card.component.css'
})
export class AssegnazioneCardComponent {
  @Input() assegnazione!: Assegnazione;
  @Input() currentUser: User | null = null;
  @Output('completa') completaEvent = new EventEmitter<Assegnazione>();
  @Output() completing = new EventEmitter<string>();

  private router = inject(Router);
  protected completingId: string | null = null;

  StatoAssegnazione = StatoAssegnazione;

  navigateToDetail() {
    if (this.assegnazione?.id) {
      this.router.navigate(['/assegnazioni', this.assegnazione.id]);
    }
  }

  onCompletaClick(event: Event) {
    event.stopPropagation();
    if (this.assegnazione?.id) {
      this.completaEvent.emit(this.assegnazione);
    }
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
      case StatoAssegnazione.ASSEGNATO:   return 'bg-primary';
      case StatoAssegnazione.COMPLETATO:  return 'bg-success';
      case StatoAssegnazione.SCADUTO:     return 'bg-warning text-dark';
      case StatoAssegnazione.ANNULLATO:   return 'bg-danger';
      default:                             return 'bg-secondary';
    }
  }
}
