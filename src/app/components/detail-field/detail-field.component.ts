import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-field',
  standalone: false,
  template: `
    <div class="detail-field">
      <span class="detail-label">
        <i class="bi {{ icon }}" *ngIf="icon"></i>
        {{ label }}
      </span>
      <span class="detail-value">
        <ng-content></ng-content>
      </span>
    </div>
  `
})
export class DetailFieldComponent {
  @Input() label = '';
  @Input() icon = '';
}