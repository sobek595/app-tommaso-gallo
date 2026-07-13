import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { User, UserRole } from '../entities/User';

@Directive({
  selector: '[appManagerOnly]',
  standalone: false
})
export class ManagerOnlyDirective implements OnChanges {
  @Input() appManagerOnly: User | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    if (this.appManagerOnly?.role === UserRole.MANAGER) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

