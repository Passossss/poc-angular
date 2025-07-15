import { Component } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../service/pedido.service';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AvisoComponent } from '../aviso/aviso.component';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, AvisoComponent, FormsModule],
  templateUrl: './lista-pedidos.html',
  styleUrl: './lista-pedidos.css'
})
export class ListaPedidos {
  pedidos: Pedido[] = [];
  filtroDescricao: string = '';
  clientes: Cliente[] = [];
  avisoMsg = '';
  avisoTipo: 'erro' | 'sucesso' = 'sucesso';
  private _deleteConfirmId: string | null = null;
  deleteConfirmPedidoId: string | null = null;

  constructor(private pedidoService: PedidoService, private clienteService: ClienteService, private router: Router, private route: ActivatedRoute) {
    this.carregarPedidos();
    this.carregarClientes();
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

  carregarClientes() {
    this.clienteService.GetClientesAsync().subscribe({
      next: (data) => this.clientes = data
    });
  }

  getNomeCliente(clienteId: string): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : '';
  }

  deletarPedido(pedido: Pedido): void {
    this.deleteConfirmPedidoId = pedido.id;
    this.avisoMsg = 'Tem certeza que deseja deletar este pedido?';
    this.avisoTipo = 'erro';
  }

  confirmarDeletePedido(): void {
    if (this.deleteConfirmPedidoId) {
      this.pedidoService.DeletePedidoAsync(this.deleteConfirmPedidoId).subscribe({
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
      this.deleteConfirmPedidoId = null;
    }
  }

  cancelarDeletePedido(): void {
    this.deleteConfirmPedidoId = null;
    this.avisoMsg = '';
  }

  editarPedido(pedido: Pedido) {
    this.router.navigate(['/pedidos/editar', pedido.id]);
  }

  novoPedido() {
    this.router.navigate(['/pedidos/criar']);
  }

  get pedidosFiltrados(): Pedido[] {
    if (!this.filtroDescricao.trim()) return this.pedidos;
    const termo = this.normalizar(this.filtroDescricao);
    return this.pedidos.filter(p => {
      const nomeCliente = this.getNomeCliente(p.clienteId);
      return this.normalizar(p.descricao).includes(termo) || this.normalizar(nomeCliente).includes(termo);
    });
  }

  normalizar(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '');
  }
}
