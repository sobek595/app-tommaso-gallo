import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Status } from '../entities/PermesionRequest';

@Directive({
  selector: '[appPendingOnly]',
  standalone: false
})
export class PendingOnlyDirective implements OnChanges {
  @Input() appPendingOnly: Status | string | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    if (this.appPendingOnly === Status.PENDING) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}


