import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, Wrench, FileText, Activity } from 'lucide-angular';
import { ClienteService } from '../../core/services/cliente.service';
import { ServicoService } from '../../core/services/servico.service';
import { OrdemServicoService } from '../../core/services/ordem-servico.service';
import { StatusOrdemServico } from '../../core/models/models';
import { forkJoin } from 'rxjs';

import { PhoneMaskPipe } from '../../shared/pipes/phone-mask.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PhoneMaskPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h2 class="text-3xl font-bold text-gray-100">Dashboard</h2>
        <p class="text-gray-500">Bem-vindo ao Sistema de Ordem de Serviço</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Clientes Card -->
        <div class="bg-surface p-6 rounded-xl border border-surface_hover flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total de Clientes</p>
            <h3 class="text-3xl font-bold text-gray-100">{{ stats.clientes }}</h3>
          </div>
          <div class="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <lucide-icon [img]="Users" class="w-6 h-6"></lucide-icon>
          </div>
        </div>

        <!-- Servicos Card -->
        <div class="bg-surface p-6 rounded-xl border border-surface_hover flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total de Serviços</p>
            <h3 class="text-3xl font-bold text-gray-100">{{ stats.servicos }}</h3>
          </div>
          <div class="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <lucide-icon [img]="Wrench" class="w-6 h-6"></lucide-icon>
          </div>
        </div>

        <!-- Ordens Card -->
        <div class="bg-surface p-6 rounded-xl border border-surface_hover flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total de Ordens</p>
            <h3 class="text-3xl font-bold text-gray-100">{{ stats.ordens }}</h3>
          </div>
          <div class="p-3 bg-green-500/10 rounded-lg text-green-500">
            <lucide-icon [img]="FileText" class="w-6 h-6"></lucide-icon>
          </div>
        </div>

        <!-- Em Aberto Card -->
        <div class="bg-surface p-6 rounded-xl border border-surface_hover flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Ordens em Aberto</p>
            <h3 class="text-3xl font-bold text-gray-100">{{ stats.emAberto }}</h3>
          </div>
          <div class="p-3 bg-orange-500/10 rounded-lg text-orange-500">
            <lucide-icon [img]="Activity" class="w-6 h-6"></lucide-icon>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Status Chart (Placeholder) -->
        <div class="bg-surface p-6 rounded-xl border border-surface_hover">
          <h3 class="text-lg font-semibold text-gray-200 mb-4">Status das Ordens</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Em Aberto</span>
              <span class="font-bold text-orange-500">{{ stats.emAberto }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Em Execução</span>
              <span class="font-bold text-blue-500">{{ stats.emExecucao }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Finalizadas</span>
              <span class="font-bold text-green-500">{{ stats.finalizadas }}</span>
            </div>
             <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">Entregues</span>
              <span class="font-bold text-purple-500">{{ stats.entregues }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-surface p-6 rounded-xl border border-surface_hover">
          <h3 class="text-lg font-semibold text-gray-200 mb-4">Últimas Ordens</h3>
          <div class="space-y-3">
            <div *ngFor="let os of recentOrders" class="p-4 bg-background rounded-lg border border-surface_hover flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-200">{{ os.clienteNome }} <span class="text-gray-500 text-xs font-normal">({{ os.clienteTelefone | phoneMask }})</span></p>
                <p class="text-xs text-gray-500">{{ os.servicoNome }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-200">R$ {{ os.valor | number:'1.2-2' }}</p>
                <span class="text-xs font-bold px-2 py-1 rounded-full bg-surface"
                  [ngClass]="{
                    'text-orange-500': os.status === 'EM_ABERTO',
                    'text-blue-500': os.status === 'EM_EXECUCAO',
                    'text-green-500': os.status === 'FINALIZADO',
                    'text-purple-500': os.status === 'ENTREGUE'
                  }">
                  {{ os.status }}
                </span>
              </div>
            </div>
            <div *ngIf="recentOrders.length === 0" class="text-center text-gray-500 py-4">
              Nenhuma ordem recente.
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  readonly Users = Users;
  readonly Wrench = Wrench;
  readonly FileText = FileText;
  readonly Activity = Activity;

  stats = {
    clientes: 0,
    servicos: 0,
    ordens: 0,
    emAberto: 0,
    emExecucao: 0,
    finalizadas: 0,
    entregues: 0
  };

  recentOrders: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private servicoService: ServicoService,
    private osService: OrdemServicoService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      clientes: this.clienteService.listar(),
      servicos: this.servicoService.listar(),
      ordens: this.osService.listar()
    }).subscribe({
      next: (data) => {
        this.stats.clientes = data.clientes.length;
        this.stats.servicos = data.servicos.length;
        this.stats.ordens = data.ordens.length;
        
        this.stats.emAberto = data.ordens.filter(o => o.status === StatusOrdemServico.EM_ABERTO).length;
        this.stats.emExecucao = data.ordens.filter(o => o.status === StatusOrdemServico.EM_EXECUCAO).length;
        this.stats.finalizadas = data.ordens.filter(o => o.status === StatusOrdemServico.FINALIZADO).length;
        this.stats.entregues = data.ordens.filter(o => o.status === StatusOrdemServico.ENTREGUE).length;

        this.recentOrders = [...data.ordens].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
      },
      error: (err) => console.error('Erro ao carregar dashboard', err)
    });
  }
}
