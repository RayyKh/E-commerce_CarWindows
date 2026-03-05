import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthApiService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.error.set(null);
    const email = this.email().trim();
    const pass = this.password().trim();
    if (!email || !pass) {
      this.error.set('Veuillez saisir identifiant et mot de passe');
      return;
    }
    this.loading.set(true);
    this.auth.login(email, pass).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.error.set('Identifiants invalides');
        this.loading.set(false);
      },
    });
  }
}
