import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { Pedido } from '../../models/pedido.model';
import { ClienteService } from '../../service/cliente.service';
import { PedidoService } from '../../service/pedido.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AvisoComponent } from '../aviso/aviso.component';

@Component({
  selector: 'app-lista-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, AvisoComponent],
  templateUrl: './lista-editar.html',
  styleUrls: ['./lista-editar.css']
})
export class ListaEditar {
  cliente: Cliente | null = null;
  pedidosCliente: Pedido[] = [];
  temId = false;

  avisoMsg = '';
  avisoTipo: 'erro' | 'sucesso' = 'erro';
  deleteConfirmClienteId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.temId = !!id;

    if (id) {
      this.carregarCliente(id);
    } else {
      this.cliente = {
        id: '',
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        dataNascimento: '',
        Pedidos: [] as any
      };
      this.pedidosCliente = [];
    }
  }

  private carregarCliente(id: string): void {
    this.clienteService.GetClienteByIdAsync(id).subscribe({
      next: (cliente: Cliente) => {
        this.cliente = {
          ...cliente,
          dataNascimento: cliente.dataNascimento?.substring(0, 10) ?? ''
        };
        this.pedidoService.GetPedidosClienteAsync(cliente.id).subscribe({
          next: pedidos => this.pedidosCliente = pedidos,
          error: () => this.pedidosCliente = []
        });
      },
      error: err => console.error('Erro ao carregar cliente:', err)
    });
  }

  validarForm(): boolean {
    if (!this.cliente) return false;
    if (this.deleteConfirmClienteId) return false;

    if (!this.cliente.nome || /\d/.test(this.cliente.nome)) {
      this.avisoMsg = 'Nome inválido: não pode conter números.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (!this.cliente.dataNascimento) {
      this.avisoMsg = 'Data de nascimento é obrigatória.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (new Date(this.cliente.dataNascimento) > new Date()) {
      this.avisoMsg = 'Data de nascimento não pode ser no futuro.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (!this.cliente.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.cliente.email)) {
      this.avisoMsg = 'Email inválido.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (!this.cliente.telefone || !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(this.cliente.telefone)) {
      this.avisoMsg = 'Telefone inválido. Use formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.';
      this.avisoTipo = 'erro';
      return false;
    }
    if (!this.cliente.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(this.cliente.cpf)) {
      this.avisoMsg = 'CPF inválido. Use formato 000.000.000-00.';
      this.avisoTipo = 'erro';
      return false;
    }

    this.avisoMsg = '';
    return true;
  }

  onCPFInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.-]/g, '');
    this.cliente!.cpf = input.value;
  }

  onTelefoneInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^\d()\s-]/g, '');
    this.cliente!.telefone = input.value;
  }

  formatarCPF(cpf: string): string {
    cpf = cpf.replace(/\D/g, '').substring(0, 11);
    if (cpf.length === 11) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  formatarTelefone(telefone: string): string {
    const digits = telefone.replace(/\D/g, '').substring(0, 11);
    if (digits.length === 11)
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (digits.length === 10)
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    if (digits.length <= 2)
      return digits.replace(/(\d{0,2})/, '($1');
    if (digits.length <= 6)
      return digits.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    return digits.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
  }

  confirmarEdicao(): void {
    if (this.deleteConfirmClienteId) return;
    if (!this.validarForm()) return;
    if (!this.cliente) return;
    const clienteEnviar = {
      ...this.cliente,
      telefone: this.cliente.telefone.replace(/\D/g, ''),
      cpf: this.cliente.cpf.replace(/\D/g, '')
    };
    const id = this.route.snapshot.paramMap.get('id');
    const salvar = id
      ? this.clienteService.UpdateClienteAsync(clienteEnviar)
      : this.clienteService.CreateClienteAsync(clienteEnviar);
    salvar.subscribe({
      next: () => {
        this.router.navigate(['/clientes'], {
          queryParams: {
            msg: `Cliente ${id ? 'atualizado' : 'criado'} com sucesso!`,
            tipo: 'sucesso'
          }
        });
      },
      error: err => {
        this.avisoMsg = `Erro ao ${id ? 'atualizar' : 'criar'} cliente!`;
        this.avisoTipo = 'erro';
        console.error('Erro:', err);
      }
    });
  }

  cancelarEdicao(): void {
    this.router.navigate(['/']);
  }

  deletarCliente(id: string): void {
    this.deleteConfirmClienteId = id;
    this.avisoMsg = 'Tem certeza que deseja deletar este cliente?';
    this.avisoTipo = 'erro';
  }

  confirmarDeleteCliente(): void {
    if (this.deleteConfirmClienteId) {
      this.clienteService.DeleteClienteAsync(this.deleteConfirmClienteId).subscribe({
        next: () => {
          this.router.navigate(['/clientes'], {
            queryParams: {
              msg: 'Cliente deletado com sucesso!',
              tipo: 'sucesso'
            }
          });
        },
        error: err => {
          this.avisoMsg = 'Erro ao deletar cliente!';
          this.avisoTipo = 'erro';
          console.error('Erro ao deletar cliente:', err);
        }
      });
      this.deleteConfirmClienteId = null;
    }
  }

  cancelarDeleteCliente(): void {
    this.deleteConfirmClienteId = null;
    this.avisoMsg = '';
  }
  private _deleteConfirm = false;

  editarPedido(pedido: Pedido): void {
    this.router.navigate(['/pedidos/editar', pedido.id]);
  }
}