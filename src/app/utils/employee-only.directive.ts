import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { User, UserRole } from '../entities/User';

@Directive({
  selector: '[appEmployeeOnly]',
  standalone: false
})
export class EmployeeOnlyDirective implements OnChanges {
  @Input() appEmployeeOnly: User | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    if (this.appEmployeeOnly?.role === UserRole.EMPLOYEE) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

