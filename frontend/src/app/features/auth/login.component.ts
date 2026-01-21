import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, Lock, User } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
      <div class="bg-surface w-full max-w-md p-8 rounded-2xl border border-surface_hover shadow-2xl">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-100 mb-2">SystemOS</h1>
          <p class="text-gray-500">Faça login para continuar</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-400">Usuário</label>
            <div class="relative">
              <lucide-icon [img]="User" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"></lucide-icon>
              <input type="text" [(ngModel)]="username" name="username" 
                class="w-full bg-background border border-surface_hover text-gray-200 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="admin">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-400">Senha</label>
            <div class="relative">
              <lucide-icon [img]="Lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"></lucide-icon>
              <input type="password" [(ngModel)]="password" name="password"
                class="w-full bg-background border border-surface_hover text-gray-200 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="admin">
            </div>
          </div>

          <div *ngIf="error" class="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg text-center">
            Usuário ou senha inválidos.
          </div>

          <button type="submit" 
            class="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20">
            Entrar
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          <p>Credenciais padrão: admin / admin</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  readonly User = User;
  readonly Lock = Lock;

  username = '';
  password = '';
  error = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.authService.login(this.username, this.password)) {
      this.error = true;
    }
  }
}
