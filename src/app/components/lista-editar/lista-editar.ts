import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../../models/cliente.model';

import { ClienteService } from '../../service/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-editar',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-editar.html',
  styleUrl: './lista-editar.css'
})
export class ListaEditar {
  cliente: Cliente | null = null;
  public temId = false;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.temId = !!id;
    if (id) {
      this.clienteService.GetClienteByIdAsync(id).subscribe({
        next: (cliente: Cliente) => {
          this.cliente = cliente;
        },
        error: (err: any) => {
          console.error('Erro ao carregar cliente:', err);
        }
      });
    } else {
      this.cliente = {
        id: '',
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        dataNascimento: '',
        Pedidos: undefined as any
      };
    }
  }

  confirmarEdicao(): void {
    if (this.cliente) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.clienteService.UpdateClienteAsync(this.cliente).subscribe({
          next: () => {
            alert('Cliente atualizado com sucesso!');
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            alert('Erro ao atualizar cliente!');
            console.error('Erro ao atualizar cliente:', err);
          }
        });
      } else {
        this.clienteService.CreateClienteAsync(this.cliente).subscribe({
          next: () => {
            alert('Cliente criado com sucesso!');
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            alert('Erro ao criar cliente!');
            console.error('Erro ao criar cliente:', err);
          }
        });
      }
    }
  }

  cancelarEdicao(): void {
    this.router.navigate(['/']);
  }

  deletarCliente(id: string): void {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      this.clienteService.DeleteClienteAsync(id).subscribe({
        next: () => {
          alert('Cliente deletado com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          alert('Erro ao deletar cliente!');
          console.error('Erro ao deletar cliente:', err);
        }
      });
    }
  }
}
