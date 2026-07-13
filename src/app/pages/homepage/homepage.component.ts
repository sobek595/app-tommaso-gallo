import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermessionRequestService } from '../../services/permession-request.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/User';
import { CreatePermessionModalComponent } from '../../components/create-permession-modal/create-permession-modal.component';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  private permessionRequestSrv = inject(PermessionRequestService);
  private modalSrv = inject(NgbModal);
  protected authSrv = inject(AuthService);

  currentUser: User | null = null;
  filterActive = false;
  permessionRequestList$ = this.permessionRequestSrv.permissionList();

  constructor() {
    this.authSrv.currentUser$.subscribe(u => this.currentUser = u);
  }

  toggleFilter() {
    this.filterActive = !this.filterActive;
    this.permessionRequestList$ = this.filterActive
      ? this.permessionRequestSrv.pendingList()
      : this.permessionRequestSrv.permissionList();
  }

  openCreateModal() {
    const ref = this.modalSrv.open(CreatePermessionModalComponent, { centered: true, size: 'lg' });
    ref.closed.subscribe(() => {
      this.permessionRequestList$ = this.permessionRequestSrv.permissionList();
    });
  }
}

