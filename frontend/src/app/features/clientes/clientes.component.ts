import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Plus, Edit2, Trash2, X } from 'lucide-angular';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/models';
import { PhoneMaskPipe } from '../../shared/pipes/phone-mask.pipe';
import { PhoneMaskDirective } from '../../shared/directives/phone-mask.directive';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PhoneMaskPipe, PhoneMaskDirective],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-100">Clientes</h2>
          <p class="text-gray-500">Total: {{ clientesFiltrados.length }} cliente(s)</p>
        </div>
        <button (click)="openModal()" class="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors">
          <lucide-icon [img]="Plus" class="w-4 h-4"></lucide-icon>
          Novo Cliente
        </button>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
          <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"></lucide-icon>
          <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterClientes()" 
            placeholder="Buscar por nome..." 
            class="w-full bg-surface border border-surface_hover text-gray-200 pl-12 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary">
        </div>
        <div class="relative">
          <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"></lucide-icon>
          <input type="text" [(ngModel)]="searchPhone" (ngModelChange)="filterClientes()" appPhoneMask
            placeholder="Buscar por telefone..." 
            class="w-full bg-surface border border-surface_hover text-gray-200 pl-12 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary">
        </div>
      </div>

      <!-- Table -->
      <div class="bg-surface rounded-xl border border-surface_hover overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-surface_hover text-gray-400 text-sm">
            <tr>
              <th class="p-4 font-medium">Nome</th>
              <th class="p-4 font-medium">Telefone</th>
              <th class="p-4 font-medium">Data de Cadastro</th>
              <th class="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface_hover">
            <tr *ngFor="let cliente of clientesFiltrados" class="hover:bg-surface_hover/50 transition-colors">
              <td class="p-4 text-gray-200 font-medium">{{ cliente.nome }}</td>
              <td class="p-4 text-gray-400">{{ cliente.telefone | phoneMask }}</td>
              <td class="p-4 text-gray-400">{{ cliente.dataCriacao | date:'dd/MM/yyyy' }}</td>
              <td class="p-4 flex justify-end gap-2">
                <button (click)="openModal(cliente)" class="p-2 hover:bg-surface_hover rounded-lg text-gray-400 hover:text-white transition-colors">
                  <lucide-icon [img]="Edit2" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="deleteCliente(cliente)" class="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                  <lucide-icon [img]="Trash2" class="w-4 h-4"></lucide-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="clientesFiltrados.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500">
                Nenhum cliente encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-surface w-full max-w-md rounded-xl border border-surface_hover shadow-2xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-100">{{ isEditing ? 'Editar Cliente' : 'Novo Cliente' }}</h3>
          <button (click)="closeModal()" class="text-gray-400 hover:text-white">
            <lucide-icon [img]="X" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Nome</label>
            <input formControlName="nome" type="text" class="w-full bg-background border border-surface_hover text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
            <p *ngIf="form.get('nome')?.touched && form.get('nome')?.invalid" class="text-red-500 text-xs mt-1">Nome é obrigatório</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Telefone</label>
            <input formControlName="telefone" type="text" appPhoneMask class="w-full bg-background border border-surface_hover text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
            <p *ngIf="form.get('telefone')?.touched && form.get('telefone')?.invalid" class="text-red-500 text-xs mt-1">Telefone é obrigatório</p>
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
export class ClientesComponent implements OnInit {
  readonly Search = Search;
  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly X = X;

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  
  searchTerm = '';
  searchPhone = '';

  isModalOpen = false;
  isEditing = false;
  form: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      telefone: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filterClientes();
      },
      error: (err) => console.error('Erro ao carregar clientes', err)
    });
  }

  filterClientes() {
    this.clientesFiltrados = this.clientes.filter(c => 
      c.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      c.telefone.includes(this.searchPhone)
    );
  }

  openModal(cliente?: Cliente) {
    this.isEditing = !!cliente;
    if (cliente) {
      this.form.patchValue(cliente);
    } else {
      this.form.reset();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.form.reset();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const cliente = this.form.value;
    console.log('Enviando Cliente:', cliente);

    if (this.isEditing && cliente.id) {
      this.clienteService.atualizar(cliente.id, cliente).subscribe({
        next: () => {
          this.loadClientes();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao atualizar cliente', err)
      });
    } else {
      this.clienteService.salvar(cliente).subscribe({
        next: () => {
          this.loadClientes();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao criar cliente', err)
      });
    }
  }

  deleteCliente(cliente: Cliente) {
    if (confirm(`Tem certeza que deseja excluir ${cliente.nome}?`)) {
      this.clienteService.excluir(cliente.id!).subscribe({
        next: () => this.loadClientes(),
        error: (err) => console.error('Erro ao excluir cliente', err)
      });
    }
  }
}
