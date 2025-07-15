import { Component } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../service/pedido.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AvisoComponent } from '../aviso/aviso.component';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, AvisoComponent],
  templateUrl: './lista-pedidos.html',
  styleUrl: './lista-pedidos.css'
})
export class ListaPedidos {
  pedidos: Pedido[] = [];
  avisoMsg = '';
  avisoTipo: 'erro' | 'sucesso' = 'sucesso';
  private _deleteConfirmId: string | null = null;

  constructor(private pedidoService: PedidoService, private router: Router, private route: ActivatedRoute) {
    this.carregarPedidos();
    this.route.queryParams.subscribe(params => {
      if (params['msg']) {
        this.avisoMsg = params['msg'];
        this.avisoTipo = params['tipo'] || 'sucesso';
        setTimeout(() => this.avisoMsg = '', 3000);
      }
    });
  }

  carregarPedidos() {
    this.pedidoService.GetPedidosAsync().subscribe({
      next: (data) => this.pedidos = data
    });
  }

  deletarPedido(pedido: Pedido): void {
    if (this._deleteConfirmId === pedido.id) {
      this.pedidoService.DeletePedidoAsync(pedido.id).subscribe({
        next: () => {
          this.avisoMsg = 'Pedido deletado com sucesso!';
          this.avisoTipo = 'sucesso';
          this.carregarPedidos();
          setTimeout(() => this.avisoMsg = '', 2000);
        },
        error: (erro) => {
          this.avisoMsg = 'Erro ao deletar pedido!';
          this.avisoTipo = 'erro';
          console.error('Erro ao deletar pedido:', erro);
        }
      });
      this._deleteConfirmId = null;
    } else {
      this.avisoMsg = 'Clique novamente para confirmar a exclusão.';
      this.avisoTipo = 'erro';
      this._deleteConfirmId = pedido.id;
      setTimeout(() => this._deleteConfirmId = null, 2000);
    }
  }

  editarPedido(pedido: Pedido) {
    this.router.navigate(['/pedidos/editar', pedido.id]);
  }

  novoPedido() {
    this.router.navigate(['/pedidos/criar']);
  }
}
