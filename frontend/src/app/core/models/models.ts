export interface Cliente {
  id?: number;
  nome: string;
  telefone: string;
  dataCriacao?: string;
  ativo?: boolean;
}

export interface Servico {
  id?: number;
  nome: string;
  valor: number;
  dataCriacao?: string;
  ativo?: boolean;
}

export enum StatusOrdemServico {
  EM_ABERTO = 'EM_ABERTO',
  EM_EXECUCAO = 'EM_EXECUCAO',
  FINALIZADO = 'FINALIZADO',
  ENTREGUE = 'ENTREGUE' // Adding this as per frontend requirement, though backend might need update if strict
}

export interface OrdemServico {
  id?: number;
  clienteId: number;
  clienteNome?: string;
  clienteTelefone?: string;
  servicoId: number;
  servicoNome?: string;
  cliente?: Cliente;
  servico?: Servico;
  valor: number;
  status: StatusOrdemServico;
  dataCriacao?: string;
  ativo?: boolean;
}

export interface DashboardStats {
  totalClientes: number;
  totalServicos: number;
  totalOrdens: number;
  ordensEmAberto: number;
}
