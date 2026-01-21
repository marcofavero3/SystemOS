import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdemServico, StatusOrdemServico } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class OrdemServicoService {
  private apiUrl = '/api/ordens-servico';

  constructor(private http: HttpClient) { }

  listar(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.apiUrl}/${id}`);
  }

  salvar(os: Partial<OrdemServico>): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(this.apiUrl, os);
  }

  atualizar(id: number, os: Partial<OrdemServico>): Observable<OrdemServico> {
    return this.http.put<OrdemServico>(`${this.apiUrl}/${id}`, os);
  }

  atualizarStatus(id: number, status: StatusOrdemServico): Observable<OrdemServico> {
    // Assuming backend supports partial update via PUT with just status
    return this.http.put<OrdemServico>(`${this.apiUrl}/${id}`, { status });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
