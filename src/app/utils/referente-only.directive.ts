import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { User, UserRole } from '../entities/User';

@Directive({
  selector: '[appReferenteOnly]',
  standalone: false
})
export class ReferenteOnlyDirective implements OnChanges {
  @Input() appReferenteOnly: User | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    if (this.appReferenteOnly?.role === UserRole.REFERENTE) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}