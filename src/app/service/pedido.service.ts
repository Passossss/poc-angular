import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model'; 
import { emit } from 'process';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrlClientesBase = environment.apiUrl + 'clientes{clienteId}';

  constructor(private http: HttpClient) { }

  
  GetPedidosAsync(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrlClientesBase}/pedidos`); 
  }

  GetPedidoByIdAsync(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrlClientesBase}/pedidos/${id}`);
  }

  CreatePedidoAsync(novoPedido: Pedido): Observable<Pedido> {
    const pedidoParaCriar = { ...novoPedido, id: undefined }; 
    return this.http.post<Pedido>(`${this.apiUrlClientesBase}/${novoPedido.clienteId}/pedidos`, pedidoParaCriar);
  }

  UpdatePedidoAsync(id: string, editadoPedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrlClientesBase}/${editadoPedido.clienteId}/pedidos/${id}`, editadoPedido);
  }

  DeletePedidoAsync(id: string, clienteId: string): Observable<Pedido[]> {
    return this.http.delete<Pedido[]>(`${this.apiUrlClientesBase}/${clienteId}/pedidos/${id}`);
  }
}