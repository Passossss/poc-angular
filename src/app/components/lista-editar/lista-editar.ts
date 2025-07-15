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
  public erroForm = '';

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
          this.cliente = {
            ...cliente,
            dataNascimento: cliente.dataNascimento ? cliente.dataNascimento.substring(0, 10) : ''
          };
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

  validarForm(): boolean {
    this.erroForm = '';
    if (!this.cliente) return false;
    if (!this.cliente.nome) { this.erroForm = 'Informe o nome.'; return false; }
    if (!this.cliente.dataNascimento) { this.erroForm = 'Informe a data de nascimento.'; return false; }
    if (new Date(this.cliente.dataNascimento) > new Date()) { this.erroForm = 'Data de nascimento não pode ser no futuro.'; return false; }
    if (!this.cliente.email) { this.erroForm = 'Informe o email.'; return false; }
    if (!this.cliente.telefone) { this.erroForm = 'Informe o telefone.'; return false; }
    if (!this.cliente.cpf) { this.erroForm = 'Informe o CPF.'; return false; }
    return true;
  }

  formatarCPF(cpf: string): string {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cpf;
  }

  formatarTelefone(telefone: string): string {
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length > 10) {
      telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length > 5) {
      telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (telefone.length > 2) {
      telefone = telefone.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    return telefone;
  }

  confirmarEdicao(): void {
    if (!this.validarForm()) return;
    if (this.cliente) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.clienteService.UpdateClienteAsync(this.cliente).subscribe({
          next: () => {
            alert('Cliente atualizado com sucesso!');
            this.router.navigate(['/clientes']);
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
            this.router.navigate(['/clientes']);
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
