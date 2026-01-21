import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LucideAngularModule, Plus, X, Calendar, DollarSign, User, Wrench } from 'lucide-angular';
import { OrdemServicoService } from '../../core/services/ordem-servico.service';
import { ClienteService } from '../../core/services/cliente.service';
import { ServicoService } from '../../core/services/servico.service';
import { OrdemServico, Cliente, Servico, StatusOrdemServico } from '../../core/models/models';
import { forkJoin } from 'rxjs';

import { PhoneMaskPipe } from '../../shared/pipes/phone-mask.pipe';

@Component({
  selector: 'app-ordem-servico',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, LucideAngularModule, PhoneMaskPipe],
  template: `
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-100">Ordens de Serviço</h2>
          <p class="text-gray-500">Gerencie o fluxo de trabalho</p>
        </div>
        <button (click)="openModal()" class="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors">
          <lucide-icon [img]="Plus" class="w-4 h-4"></lucide-icon>
          Nova OS
        </button>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 overflow-x-auto overflow-y-hidden">
        <div class="flex gap-6 h-full min-w-[1000px]">
          
          <!-- Column: Em Aberto -->
          <div class="flex-1 flex flex-col bg-surface/50 rounded-xl border border-surface_hover h-full">
            <div class="p-4 border-b border-surface_hover flex justify-between items-center">
              <h3 class="font-bold text-gray-200">Em Aberto</h3>
              <span class="bg-orange-500/10 text-orange-500 text-xs px-2 py-1 rounded-full font-bold">{{ emAberto.length }}</span>
            </div>
            <div
              cdkDropList
              #todoList="cdkDropList"
              [cdkDropListData]="emAberto"
              [cdkDropListConnectedTo]="[doingList, doneList, deliveredList]"
              class="flex-1 p-4 space-y-3 overflow-y-auto"
              (cdkDropListDropped)="drop($event, 'EM_ABERTO')">
              
              <div *ngFor="let item of emAberto" cdkDrag class="bg-surface p-4 rounded-lg border border-surface_hover shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">#{{ item.id }}</span>
                  <span class="text-xs text-gray-500">{{ item.dataCriacao | date:'dd/MM' }}</span>
                </div>
                <h4 class="font-bold text-gray-200 mb-0.5">{{ item.clienteNome }}</h4>
                <p class="text-xs text-gray-400 mb-2">{{ item.clienteTelefone | phoneMask }}</p>
                <p class="text-sm text-gray-300 mb-3 bg-background/50 px-2 py-1 rounded">{{ item.servicoNome }}</p>
                <div class="flex justify-between items-center pt-3 border-t border-surface_hover">
                  <span class="font-bold text-gray-300 text-sm">R$ {{ item.valor | number:'1.2-2' }}</span>
                  <button (click)="deleteOS(item)" class="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <lucide-icon [img]="X" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Column: Em Execução -->
          <div class="flex-1 flex flex-col bg-surface/50 rounded-xl border border-surface_hover h-full">
            <div class="p-4 border-b border-surface_hover flex justify-between items-center">
              <h3 class="font-bold text-gray-200">Em Execução</h3>
              <span class="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded-full font-bold">{{ emExecucao.length }}</span>
            </div>
            <div
              cdkDropList
              #doingList="cdkDropList"
              [cdkDropListData]="emExecucao"
              [cdkDropListConnectedTo]="[todoList, doneList, deliveredList]"
              class="flex-1 p-4 space-y-3 overflow-y-auto"
              (cdkDropListDropped)="drop($event, 'EM_EXECUCAO')">
              
              <div *ngFor="let item of emExecucao" cdkDrag class="bg-surface p-4 rounded-lg border border-surface_hover shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-colors group">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">#{{ item.id }}</span>
                  <span class="text-xs text-gray-500">{{ item.dataCriacao | date:'dd/MM' }}</span>
                </div>
                <h4 class="font-bold text-gray-200 mb-0.5">{{ item.clienteNome }}</h4>
                <p class="text-xs text-gray-400 mb-2">{{ item.clienteTelefone | phoneMask }}</p>
                <p class="text-sm text-gray-300 mb-3 bg-background/50 px-2 py-1 rounded">{{ item.servicoNome }}</p>
                <div class="flex justify-between items-center pt-3 border-t border-surface_hover">
                  <span class="font-bold text-gray-300 text-sm">R$ {{ item.valor | number:'1.2-2' }}</span>
                </div>
              </div>
              
            </div>
          </div>

          <!-- Column: Finalizado -->
          <div class="flex-1 flex flex-col bg-surface/50 rounded-xl border border-surface_hover h-full">
            <div class="p-4 border-b border-surface_hover flex justify-between items-center">
              <h3 class="font-bold text-gray-200">Finalizado</h3>
              <span class="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full font-bold">{{ finalizado.length }}</span>
            </div>
            <div
              cdkDropList
              #doneList="cdkDropList"
              [cdkDropListData]="finalizado"
              [cdkDropListConnectedTo]="[todoList, doingList, deliveredList]"
              class="flex-1 p-4 space-y-3 overflow-y-auto"
              (cdkDropListDropped)="drop($event, 'FINALIZADO')">
              
              <div *ngFor="let item of finalizado" cdkDrag class="bg-surface p-4 rounded-lg border border-surface_hover shadow-sm cursor-grab active:cursor-grabbing hover:border-green-500/50 transition-colors group">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">#{{ item.id }}</span>
                  <span class="text-xs text-gray-500">{{ item.dataCriacao | date:'dd/MM' }}</span>
                </div>
                <h4 class="font-bold text-gray-200 mb-0.5">{{ item.clienteNome }}</h4>
                <p class="text-xs text-gray-400 mb-2">{{ item.clienteTelefone | phoneMask }}</p>
                <p class="text-sm text-gray-300 mb-3 bg-background/50 px-2 py-1 rounded">{{ item.servicoNome }}</p>
                <div class="flex justify-between items-center pt-3 border-t border-surface_hover">
                  <span class="font-bold text-gray-300 text-sm">R$ {{ item.valor | number:'1.2-2' }}</span>
                </div>
              </div>
              
            </div>
          </div>

          <!-- Column: Entregue -->
          <div class="flex-1 flex flex-col bg-surface/50 rounded-xl border border-surface_hover h-full">
            <div class="p-4 border-b border-surface_hover flex justify-between items-center">
              <h3 class="font-bold text-gray-200">Entregue</h3>
              <span class="bg-purple-500/10 text-purple-500 text-xs px-2 py-1 rounded-full font-bold">{{ entregue.length }}</span>
            </div>
            <div
              cdkDropList
              #deliveredList="cdkDropList"
              [cdkDropListData]="entregue"
              [cdkDropListConnectedTo]="[todoList, doingList, doneList]"
              class="flex-1 p-4 space-y-3 overflow-y-auto"
              (cdkDropListDropped)="drop($event, 'ENTREGUE')">
              
              <div *ngFor="let item of entregue" cdkDrag class="bg-surface p-4 rounded-lg border border-surface_hover shadow-sm cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-colors group">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">#{{ item.id }}</span>
                  <span class="text-xs text-gray-500">{{ item.dataCriacao | date:'dd/MM' }}</span>
                </div>
                <h4 class="font-bold text-gray-200 mb-0.5">{{ item.clienteNome }}</h4>
                <p class="text-xs text-gray-400 mb-2">{{ item.clienteTelefone | phoneMask }}</p>
                <p class="text-sm text-gray-300 mb-3 bg-background/50 px-2 py-1 rounded">{{ item.servicoNome }}</p>
                <div class="flex justify-between items-center pt-3 border-t border-surface_hover">
                  <span class="font-bold text-gray-300 text-sm">R$ {{ item.valor | number:'1.2-2' }}</span>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal Nova OS -->
    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-surface w-full max-w-md rounded-xl border border-surface_hover shadow-2xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-100">Nova Ordem de Serviço</h3>
          <button (click)="closeModal()" class="text-gray-400 hover:text-white">
            <lucide-icon [img]="X" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Cliente Select -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Cliente</label>
            <select formControlName="clienteId" class="w-full bg-background border border-surface_hover text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
              <option [ngValue]="null">Selecione um cliente</option>
              <option *ngFor="let c of clientes" [ngValue]="c.id">{{ c.nome }}</option>
            </select>
          </div>
          
          <!-- Servico Select -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Serviço</label>
            <select formControlName="servicoId" (change)="onServicoChange()" class="w-full bg-background border border-surface_hover text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
              <option [ngValue]="null">Selecione um serviço</option>
              <option *ngFor="let s of servicos" [ngValue]="s.id">{{ s.nome }} (R$ {{ s.valor }})</option>
            </select>
          </div>

          <!-- Valor (Editable) -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Valor (R$)</label>
            <input formControlName="valor" type="number" step="0.01" class="w-full bg-background border border-surface_hover text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" (click)="closeModal()" class="px-4 py-2 text-gray-400 hover:text-white hover:bg-surface_hover rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OrdemServicoComponent implements OnInit {
  readonly Plus = Plus;
  readonly X = X;

  // Kanban Columns
  emAberto: OrdemServico[] = [];
  emExecucao: OrdemServico[] = [];
  finalizado: OrdemServico[] = [];
  entregue: OrdemServico[] = [];

  // Data for Modal
  clientes: Cliente[] = [];
  servicos: Servico[] = [];

  isModalOpen = false;
  form: FormGroup;

  constructor(
    private osService: OrdemServicoService,
    private clienteService: ClienteService,
    private servicoService: ServicoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      clienteId: [null, Validators.required],
      servicoId: [null, Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      status: [StatusOrdemServico.EM_ABERTO]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      ordens: this.osService.listar(),
      clientes: this.clienteService.listar(),
      servicos: this.servicoService.listar()
    }).subscribe({
      next: (data) => {
        this.distributeOrders(data.ordens);
        this.clientes = data.clientes;
        this.servicos = data.servicos;
      },
      error: (err) => console.error('Erro ao carregar dados', err)
    });
  }

  distributeOrders(ordens: OrdemServico[]) {
    this.emAberto = ordens.filter(o => o.status === StatusOrdemServico.EM_ABERTO);
    this.emExecucao = ordens.filter(o => o.status === StatusOrdemServico.EM_EXECUCAO);
    this.finalizado = ordens.filter(o => o.status === StatusOrdemServico.FINALIZADO);
    this.entregue = ordens.filter(o => o.status === StatusOrdemServico.ENTREGUE);
  }

  drop(event: CdkDragDrop<OrdemServico[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const statusEnum = newStatus as StatusOrdemServico;

      // Update backend first
      this.osService.atualizarStatus(item.id!, statusEnum).subscribe({
        next: (updatedOs) => {
          // Only move visually if backend succeeds
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
          // Update local item status
          event.container.data[event.currentIndex].status = statusEnum;
        },
        error: (err) => {
          console.error('Erro ao atualizar status', err);
          // Optional: Revert drag or show toast
        }
      });
    }
  }

  openModal() {
    this.form.reset({
      valor: 0,
      status: StatusOrdemServico.EM_ABERTO
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onServicoChange() {
    const servicoId = this.form.get('servicoId')?.value;
    if (servicoId) {
      const servico = this.servicos.find(s => s.id === servicoId);
      if (servico) {
        this.form.patchValue({ valor: servico.valor });
      }
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const os = this.form.value;
    console.log('Enviando OS:', os);
    
    this.osService.salvar(os).subscribe({
      next: (newOs) => {
        console.log('OS criada com sucesso:', newOs);
        this.loadData();
        this.closeModal();
      },
      error: (err) => console.error('Erro ao criar OS', err)
    });
  }

  deleteOS(os: OrdemServico) {
    if (confirm(`Tem certeza que deseja excluir a OS #${os.id}?`)) {
      this.osService.excluir(os.id!).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Erro ao excluir OS', err)
      });
    }
  }
}
