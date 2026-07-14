import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../entities/User';

function hasDigit(control: AbstractControl): ValidationErrors | null {
  return /\d/.test(control.value) ? null : { noDigit: true };
}

function hasSpecialChar(control: AbstractControl): ValidationErrors | null {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(control.value) ? null : { noSpecialChar: true };
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);

  roles = Object.values(UserRole);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: [null as UserRole | null, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), hasDigit, hasSpecialChar]]
  });

  registerError = '';

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { firstName, lastName, role, email, password } = this.registerForm.value;
    this.authSrv.register(firstName!, lastName!, role!, email!, password!)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => { this.registerError = err.error?.message ?? 'Errore durante la registrazione.'; }
      });
  }
}