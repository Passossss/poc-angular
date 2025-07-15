import { Component } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../service/pedido.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-pedidos.html',
  styleUrl: './lista-pedidos.css'
})
export class ListaPedidos {
  pedidos: Pedido[] = [];

  constructor(private pedidoService: PedidoService, private router: Router) {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.pedidoService.GetPedidosAsync().subscribe({
      next: (data) => this.pedidos = data
    });
  }

  deletarPedido(pedido: Pedido): void {
    if (confirm('Tem certeza que deseja deletar este pedido?')) {
      this.pedidoService.DeletePedidoAsync(pedido.id).subscribe({
        next: () => {
          alert('Pedido deletado com sucesso!');
          this.carregarPedidos();
        },
        error: (erro) => {
          alert('Erro ao deletar pedido!');
          console.error('Erro ao deletar pedido:', erro);
        }
      });
    }
  }

  editarPedido(pedido: Pedido) {
    this.router.navigate(['/pedidos/editar', pedido.id]);
  }

  novoPedido() {
    this.router.navigate(['/pedidos/criar']);
  }
}
