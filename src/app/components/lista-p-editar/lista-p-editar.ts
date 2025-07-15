import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../service/pedido.service';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvisoComponent } from '../aviso/aviso.component';

@Component({
  selector: 'app-lista-p-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, AvisoComponent],
  templateUrl: './lista-p-editar.html',
  styleUrls: ['./lista-p-editar.css']
})
export class ListaPEditar {
  pedido: Pedido | null = null;
  clientes: Cliente[] = [];
  public temId = false;

  avisoMsg = '';
  avisoTipo: 'erro' | 'sucesso' = 'erro';
  private _deleteConfirm = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clienteService.GetClientesAsync().subscribe({
      next: (clientes) => this.clientes = clientes
    });
    const id = this.route.snapshot.paramMap.get('id');
    this.temId = !!id;
    if (id) {
      this.pedidoService.GetPedidoByIdAsync(id).subscribe({
        next: (pedido: Pedido) => {
          this.pedido = {
            ...pedido,
            dataPedido: new Date(pedido.dataPedido)
          };
        },
        error: (err: any) => {
          console.error('Erro ao carregar pedido:', err);
          this.avisoMsg = 'Erro ao carregar pedido.';
          this.avisoTipo = 'erro';
        }
      });
    } else {
      this.pedido = {
        id: '',
        clienteId: '',
        dataPedido: new Date(),
        descricao: '',
        valor: 0
      };
    }
  }

  validarForm(): boolean {
    if (!this.pedido) return false;

    if (!this.pedido.clienteId) {
      this.avisoMsg = 'Selecione um cliente.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (!this.pedido.dataPedido) {
      this.avisoMsg = 'Informe a data do pedido.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (new Date(this.pedido.dataPedido) > new Date()) {
      this.avisoMsg = 'Data do pedido não pode ser no futuro.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (!this.pedido.descricao || this.pedido.descricao.trim().length === 0) {
      this.avisoMsg = 'Informe a descrição.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (this.pedido.valor === null || this.pedido.valor === undefined || this.pedido.valor < 0) {
      this.avisoMsg = 'Informe um valor válido.';
      this.avisoTipo = 'erro';
      return false;
    }

    this.avisoMsg = '';
    return true;
  }

  confirmarEdicao(): void {
    if (!this.validarForm()) return;
    if (!this.pedido) return;
    const id = this.route.snapshot.paramMap.get('id');
    const salvar = id
      ? this.pedidoService.UpdatePedidoAsync(this.pedido.id, this.pedido)
      : this.pedidoService.CreatePedidoAsync(this.pedido);
    salvar.subscribe({
      next: () => {
        this.router.navigate(['/pedidos'], {
          queryParams: {
            msg: `Pedido ${id ? 'atualizado' : 'criado'} com sucesso!`,
            tipo: 'sucesso'
          }
        });
      },
      error: err => {
        this.avisoMsg = `Erro ao ${id ? 'atualizar' : 'criar'} pedido!`;
        this.avisoTipo = 'erro';
        console.error('Erro:', err);
      }
    });
  }

  cancelarEdicao(): void {
    this.router.navigate(['/pedidos']);
  }

  deletarPedido(): void {
    if (this._deleteConfirm) {
      if (this.pedido && this.temId) {
        this.pedidoService.DeletePedidoAsync(this.pedido.id).subscribe({
          next: () => {
            this.avisoMsg = 'Pedido deletado com sucesso!';
            this.avisoTipo = 'sucesso';
            setTimeout(() => this.router.navigate(['/pedidos']), 1500);
          },
          error: (err: any) => {
            this.avisoMsg = 'Erro ao deletar pedido!';
            this.avisoTipo = 'erro';
            console.error('Erro ao deletar pedido:', err);
          }
        });
      }
      this._deleteConfirm = false;
    } else {
      this.avisoMsg = 'Clique novamente para confirmar a exclusão.';
      this.avisoTipo = 'erro';
      this._deleteConfirm = true;
      setTimeout(() => this._deleteConfirm = false, 2000);
    }
  }
}
