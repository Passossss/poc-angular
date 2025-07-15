import { Component } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AvisoComponent } from '../aviso/aviso.component';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule, AvisoComponent, FormsModule],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.css'
})
export class ListaClientesComponent {
  clientes: Cliente[] = [];
  filtroNome: string = '';
  avisoMsg = '';
  avisoTipo: 'erro' | 'sucesso' = 'sucesso';
  private _deleteConfirmId: string | null = null;
  deleteConfirmClienteId: string | null = null;

  constructor(private clienteService: ClienteService, private router: Router, private route: ActivatedRoute) {
    this.carregarClientes();
    this.route.queryParams.subscribe(params => {
      if (params['msg']) {
        this.avisoMsg = params['msg'];
        this.avisoTipo = params['tipo'] || 'sucesso';
        setTimeout(() => this.avisoMsg = '', 3000);
      }
    });
  }

  carregarClientes() {
    this.clienteService.GetClientesAsync().subscribe({
      next: (data) => this.clientes = data
    });
  }

  deletarCliente(id: string): void {
    this.deleteConfirmClienteId = id;
    this.avisoMsg = 'Tem certeza que deseja deletar este cliente?';
    this.avisoTipo = 'erro';
  }

  confirmarDeleteCliente(): void {
    if (this.deleteConfirmClienteId) {
      this.clienteService.DeleteClienteAsync(this.deleteConfirmClienteId).subscribe({
        next: () => {
          this.avisoMsg = 'Cliente deletado com sucesso!';
          this.avisoTipo = 'sucesso';
          this.carregarClientes();
          setTimeout(() => this.avisoMsg = '', 2000);
        },
        error: (erro) => {
          this.avisoMsg = 'Erro ao deletar cliente!';
          this.avisoTipo = 'erro';
          console.error('Erro ao deletar cliente:', erro);
        }
      });
      this.deleteConfirmClienteId = null;
    }
  }

  cancelarDeleteCliente(): void {
    this.deleteConfirmClienteId = null;
    this.avisoMsg = '';
  }

  editarCliente(id: string) {
    window.location.href = `/lista-editar.html?id=${id}`;
  }
  cancelarEdicao() {
    this.avisoMsg = '';
  }
  Edicao(cliente: Cliente) {
    this.router.navigate(['/editar', cliente.id]);
  }
  novoCliente() {
    this.router.navigate(['/criar']);
  }
  selecionarCliente(cliente: Cliente) {
    this.router.navigate(['/editar', cliente.id]);
  }

  get clientesFiltrados(): Cliente[] {
    if (!this.filtroNome.trim()) return this.clientes;
    const termo = this.normalizar(this.filtroNome);
    return this.clientes.filter(c => this.normalizar(c.nome).includes(termo));
  }

  normalizar(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '');
  }
}