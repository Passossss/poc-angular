import { Component } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AvisoComponent } from '../aviso/aviso.component';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule, AvisoComponent],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.css'
})
export class ListaClientesComponent {
  clientes: Cliente[] = [];
  avisoMsg = '';
  avisoTipo: 'erro' | 'sucesso' = 'sucesso';
  private _deleteConfirmId: string | null = null;

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
    if (this._deleteConfirmId === id) {
      this.clienteService.DeleteClienteAsync(id).subscribe({
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
      this._deleteConfirmId = null;
    } else {
      this.avisoMsg = 'Clique novamente para confirmar a exclusão.';
      this.avisoTipo = 'erro';
      this._deleteConfirmId = id;
      setTimeout(() => this._deleteConfirmId = null, 2000);
    }
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
}