import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { User, UserRole } from '../entities/User';

@Directive({
  selector: '[appDipendenteOnly]',
  standalone: false
})
export class DipendenteOnlyDirective implements OnChanges {
  @Input() appDipendenteOnly: User | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    if (this.appDipendenteOnly?.role === UserRole.DIPENDENTE) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}