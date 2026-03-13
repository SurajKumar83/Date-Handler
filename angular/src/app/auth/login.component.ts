import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  signUpLoading = false;
  error = '';
  signUpError = '';
  signUpSuccess = '';
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  signUpForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    timezone: [this.timezone, [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submitLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';
    const { email, password } = this.loginForm.value;

    this.auth.login(email as string, password as string).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([res.user.role === 'admin' ? '/admin' : '/employee']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }

  submitSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.signUpLoading = true;
    this.signUpError = '';
    this.signUpSuccess = '';

    const { name, email, password, timezone } = this.signUpForm.value;

    this.auth.register(name as string, email as string, password as string, timezone as string).subscribe({
      next: (res) => {
        this.signUpLoading = false;
        this.signUpSuccess = `${res.message}. You can now sign in.`;
        this.signUpForm.patchValue({ password: '', terms: false });
      },
      error: (err) => {
        this.signUpLoading = false;
        this.signUpError = err?.error?.message || 'Signup failed';
      }
    });
  }
}
