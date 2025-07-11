import { Pedido } from "./pedido.model";

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  Pedidos: Pedido;
}
