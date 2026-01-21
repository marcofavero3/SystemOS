import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Plus, Edit2, Trash2, X } from 'lucide-angular';
import { ServicoService } from '../../core/services/servico.service';
import { Servico } from '../../core/models/models';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-100">Serviços</h2>
          <p class="text-gray-500">Total: {{ servicos.length }} serviço(s)</p>
        </div>
        <button (click)="openModal()" class="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors">
          <lucide-icon [img]="Plus" class="w-4 h-4"></lucide-icon>
          Novo Serviço
        </button>
      </div>

      <!-- Table -->
      <div class="bg-surface rounded-xl border border-surface_hover overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-surface_hover text-gray-400 text-sm">
            <tr>
              <th class="p-4 font-medium">Nome</th>
              <th class="p-4 font-medium">Valor</th>
              <th class="p-4 font-medium">Data de Cadastro</th>
              <th class="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface_hover">
            <tr *ngFor="let servico of servicos" class="hover:bg-surface_hover/50 transition-colors">
              <td class="p-4 text-gray-200 font-medium">{{ servico.nome }}</td>
              <td class="p-4 text-blue-400 font-bold">R$ {{ servico.valor | number:'1.2-2' }}</td>
              <td class="p-4 text-gray-400">{{ servico.dataCriacao | date:'dd/MM/yyyy' }}</td>
              <td class="p-4 flex justify-end gap-2">
                <button (click)="openModal(servico)" class="p-2 hover:bg-surface_hover rounded-lg text-gray-400 hover:text-white transition-colors">
                  <lucide-icon [img]="Edit2" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="deleteServico(servico)" class="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                  <lucide-icon [img]="Trash2" class="w-4 h-4"></lucide-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="servicos.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500">
                Nenhum serviço encontrado.
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
          <h3 class="text-xl font-bold text-gray-100">{{ isEditing ? 'Editar Serviço' : 'Novo Serviço' }}</h3>
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
            <label class="block text-sm font-medium text-gray-400 mb-1">Valor (R$)</label>
            <input formControlName="valor" type="number" step="0.01" class="w-full bg-background border border-surface_hover text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
            <p *ngIf="form.get('valor')?.touched && form.get('valor')?.invalid" class="text-red-500 text-xs mt-1">Valor é obrigatório e deve ser maior que 0</p>
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
export class ServicosComponent implements OnInit {
  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly X = X;

  servicos: Servico[] = [];
  
  isModalOpen = false;
  isEditing = false;
  form: FormGroup;

  constructor(
    private servicoService: ServicoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.loadServicos();
  }

  loadServicos() {
    this.servicoService.listar().subscribe({
      next: (data) => this.servicos = data,
      error: (err) => console.error('Erro ao carregar serviços', err)
    });
  }

  openModal(servico?: Servico) {
    this.isEditing = !!servico;
    if (servico) {
      this.form.patchValue(servico);
    } else {
      this.form.reset({ valor: 0 });
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

    const servico = this.form.value;

    if (this.isEditing && servico.id) {
      this.servicoService.atualizar(servico.id, servico).subscribe({
        next: () => {
          this.loadServicos();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao atualizar serviço', err)
      });
    } else {
      this.servicoService.salvar(servico).subscribe({
        next: () => {
          this.loadServicos();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao criar serviço', err)
      });
    }
  }

  deleteServico(servico: Servico) {
    if (confirm(`Tem certeza que deseja excluir ${servico.nome}?`)) {
      this.servicoService.excluir(servico.id!).subscribe({
        next: () => this.loadServicos(),
        error: (err) => console.error('Erro ao excluir serviço', err)
      });
    }
  }
}
