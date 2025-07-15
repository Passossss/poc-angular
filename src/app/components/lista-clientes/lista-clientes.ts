import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.css'
})
export class ListaClientesComponent {
  clientes: Cliente[] = [];
  clienteEditando: Cliente | null = null;

  constructor(private clienteService: ClienteService, private router: Router) {
    this.carregarClientes();
   }

   carregarClientes() {
    this.clienteService.GetClientesAsync().subscribe({
      next: (data) => this.clientes = data
    });
  }

  deletarCliente(id: string): void {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      this.clienteService.DeleteClienteAsync(id).subscribe({ 
        next: (resposta) => {
          console.log('Cliente deletado com sucesso!', resposta);
          this.carregarClientes();
        },
        error: (erro) => {
          console.error('Erro ao deletar cliente:', erro);
        }
      });
    }
  }
editarCliente(id: string) {
  window.location.href = `/lista-editar.html?id=${id}`;
}
  cancelarEdicao() {
    this.clienteEditando = null;
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