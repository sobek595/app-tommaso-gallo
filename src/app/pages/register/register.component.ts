import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { UserRole } from '../../entities/User';

function hasUppercase(control: AbstractControl): ValidationErrors | null {
  return /[A-Z]/.test(control.value) ? null : { noUppercase: true };
}

function hasTwoDigits(control: AbstractControl): ValidationErrors | null {
  return (control.value.match(/\d/g) || []).length >= 2 ? null : { notEnoughDigits: true };
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
protected authSrv = inject(AuthService)
protected router = inject(Router)

roles = Object.values(UserRole);

registerForm = this.fb.group({
    firstName: ['', {validators: Validators.required}],
    lastName: ['', {validators: Validators.required}],
    role: [null,{validators: Validators.required}],
    email: ['', {validators: [Validators.required, Validators.email]}],
    password: ['', {validators: [Validators.required, Validators.minLength(8), hasUppercase, hasTwoDigits, hasSpecialChar]}]
  })

  
  registerError = '';


  register() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }
  if (this.registerForm.valid) {
        const {firstName,lastName,role,email,password} = this.registerForm.value;
        this.authSrv.register(firstName!,lastName!,role!,email!,password!)
          .pipe(
            catchError(err => {
              this.registerError = err.error.message;
              return throwError(() => err);   
            })
          )
          .subscribe(() => {
            this.router.navigate(['/login'])
          });
      }
    }
}

