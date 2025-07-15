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
  styleUrl: './lista-editar.css'
})
export class ListaEditar {
  cliente: Cliente | null = null;
  pedidosCliente: Pedido[] = [];
  temId = false;
  erroForm = '';
  avisoMsg = '';
  avisoTipo: 'erro' | 'sucesso' = 'erro';

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

  get pedidosDoClienteSelecionado(): Pedido[] {
    return this.pedidosCliente ?? [];
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
    if (!this.validarForm()) return;

    if (!this.cliente) return;

    const id = this.route.snapshot.paramMap.get('id');

    const salvar = id
      ? this.clienteService.UpdateClienteAsync(this.cliente)
      : this.clienteService.CreateClienteAsync(this.cliente);

    salvar.subscribe({
      next: () => {
        this.avisoMsg = `Cliente ${id ? 'atualizado' : 'criado'} com sucesso!`;
        this.avisoTipo = 'sucesso';
        setTimeout(() => this.router.navigate(['/clientes']), 1500);
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
    this.avisoMsg = 'Clique novamente para confirmar a exclusão.';
    this.avisoTipo = 'erro';
    if (this._deleteConfirm) {
      this.clienteService.DeleteClienteAsync(id).subscribe({
        next: () => {
          this.avisoMsg = 'Cliente deletado com sucesso!';
          this.avisoTipo = 'sucesso';
          setTimeout(() => this.router.navigate(['/clientes']), 1500);
        },
        error: err => {
          this.avisoMsg = 'Erro ao deletar cliente!';
          this.avisoTipo = 'erro';
          console.error('Erro ao deletar cliente:', err);
        }
      });
      this._deleteConfirm = false;
    } else {
      this._deleteConfirm = true;
      setTimeout(() => this._deleteConfirm = false, 2000);
    }
  }
  private _deleteConfirm = false;

  editarPedido(pedido: Pedido): void {
    this.router.navigate(['/pedidos/editar', pedido.id]);
  }
}
