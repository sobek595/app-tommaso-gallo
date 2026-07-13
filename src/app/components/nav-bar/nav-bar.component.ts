import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/User';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @Input()
  user: User | null = null;

  @Output('logout')
  logoutEvent = new EventEmitter<void>();

  protected authSrv = inject(AuthService);
  
  currentUser$ = this.authSrv.currentUser$;

  logout() {
    this.logoutEvent.emit();
  }
}
