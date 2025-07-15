import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../service/pedido.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-p-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-p-editar.html',
  styleUrl: './lista-p-editar.css'
})
export class ListaPEditar {
  pedido: Pedido | null = null;
  public temId = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.temId = !!id;
    if (id) {
      this.pedidoService.GetPedidoByIdAsync(id).subscribe({
        next: (pedido: Pedido) => {
          this.pedido = pedido;
        },
        error: (err: any) => {
          console.error('Erro ao carregar pedido:', err);
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

  confirmarEdicao(): void {
    if (this.pedido) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.pedidoService.UpdatePedidoAsync(this.pedido.id, this.pedido).subscribe({
          next: () => {
            alert('Pedido atualizado com sucesso!');
            this.router.navigate(['/pedidos']);
          },
          error: (err: any) => {
            alert('Erro ao atualizar pedido!');
            console.error('Erro ao atualizar pedido:', err);
          }
        });
      } else {
        this.pedidoService.CreatePedidoAsync(this.pedido).subscribe({
          next: () => {
            alert('Pedido criado com sucesso!');
            this.router.navigate(['/pedidos']);
          },
          error: (err: any) => {
            alert('Erro ao criar pedido!');
            console.error('Erro ao criar pedido:', err);
          }
        });
      }
    }
  }

  cancelarEdicao(): void {
    this.router.navigate(['/pedidos']);
  }

  deletarPedido(): void {
    if (this.pedido && this.temId && confirm('Tem certeza que deseja deletar este pedido?')) {
      this.pedidoService.DeletePedidoAsync(this.pedido.id, this.pedido.clienteId).subscribe({
        next: () => {
          alert('Pedido deletado com sucesso!');
          this.router.navigate(['/pedidos']);
        },
        error: (err: any) => {
          alert('Erro ao deletar pedido!');
          console.error('Erro ao deletar pedido:', err);
        }
      });
    }
  }
}
