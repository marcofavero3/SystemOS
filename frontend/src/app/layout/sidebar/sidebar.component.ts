import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Users, Wrench, FileText, DollarSign, LogOut } from 'lucide-angular';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <aside class="h-screen w-64 bg-background border-r border-surface flex flex-col fixed left-0 top-0">
      <!-- Logo -->
      <div class="p-6">
        <h1 class="text-xl font-bold text-gray-100">OS System</h1>
        <p class="text-xs text-gray-500">Gestão de Ordens</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-2">
        <a routerLink="/dashboard" routerLinkActive="bg-primary text-white" 
           class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-surface hover:text-white transition-colors group">
          <lucide-icon [img]="Home" class="w-5 h-5"></lucide-icon>
          Dashboard
        </a>

        <a routerLink="/clientes" routerLinkActive="bg-primary text-white" 
           class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-surface hover:text-white transition-colors group">
          <lucide-icon [img]="Users" class="w-5 h-5"></lucide-icon>
          Clientes
        </a>

        <a routerLink="/servicos" routerLinkActive="bg-primary text-white" 
           class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-surface hover:text-white transition-colors group">
          <lucide-icon [img]="Wrench" class="w-5 h-5"></lucide-icon>
          Serviços
        </a>

        <a routerLink="/ordens-servico" routerLinkActive="bg-primary text-white" 
           class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-surface hover:text-white transition-colors group">
          <lucide-icon [img]="FileText" class="w-5 h-5"></lucide-icon>
          Ordens de Serviço
        </a>

        <!-- <a routerLink="/financeiro" routerLinkActive="bg-primary text-white" 
           class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-surface hover:text-white transition-colors group">
          <lucide-icon [img]="DollarSign" class="w-5 h-5"></lucide-icon>
          Resumo Financeiro
        </a> -->
      </nav>

      <!-- User Profile / Logout -->
      <div class="p-4 border-t border-surface">
        <div class="mb-3">
          <p class="text-xs text-gray-500">Usuário</p>
          <p class="text-sm font-medium text-gray-200">Admin</p>
        </div>
        <button (click)="logout()" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-surface rounded-lg transition-colors border border-surface">
          <lucide-icon [img]="LogOut" class="w-4 h-4"></lucide-icon>
          Sair
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  readonly Home = Home;
  readonly Users = Users;
  readonly Wrench = Wrench;
  readonly FileText = FileText;
  readonly DollarSign = DollarSign;
  readonly LogOut = LogOut;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
