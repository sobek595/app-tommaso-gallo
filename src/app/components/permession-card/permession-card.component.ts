import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionRequest, Status } from '../../entities/PermesionRequest';
import { User } from '../../entities/User';
import { Category } from '../../entities/Category';

@Component({
  selector: 'app-permession-card',
  standalone: false,
  templateUrl: './permession-card.component.html',
  styleUrl: './permession-card.component.css'
})
export class PermessionCardComponent {
  @Input() request!: PermissionRequest;

  private router = inject(Router);

  navigateToDetail() {
    if (this.request?.id) {
      this.router.navigate(['/permessi', this.request.id]);
    }
  }

  get requester(): User | null {
    return this.request?.userIdRequesting && typeof this.request.userIdRequesting === 'object'
      ? (this.request.userIdRequesting as User)
      : null;
  }

  get category(): Category | null {
    return this.request?.categoryId && typeof this.request.categoryId === 'object'
      ? (this.request.categoryId as Category)
      : null;
  }

  get approver(): User | null {
    return this.request?.userIdApproving && typeof this.request.userIdApproving === 'object'
      ? (this.request.userIdApproving as User)
      : null;
  }

  get statusClass(): string {
    switch (this.request?.status) {
      case Status.APPROVED:  return 'bg-success';
      case Status.REJECTED:  return 'bg-danger';
      default:               return 'bg-warning text-dark';
    }
  }
}
