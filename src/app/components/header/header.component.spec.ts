import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class ListaClientesComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.GetClientesAsync().subscribe({
      next: (dados) => {
        this.clientes = dados;
        console.log('Clientes carregados:', this.clientes);
      },
      error: (erro) => {
        console.error('Erro ao carregar clientes:', erro);
      }
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
}