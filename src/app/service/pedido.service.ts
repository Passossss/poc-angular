import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model'; 
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = environment.apiUrl + '/pedidos';

  constructor(private http: HttpClient) { }

  GetPedidosAsync(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl); 
  }

  GetPedidoByIdAsync(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  CreatePedidoAsync(novoPedido: Pedido): Observable<Pedido> {
    const pedidoParaCriar = { ...novoPedido, id: undefined }; 
    return this.http.post<Pedido>(this.apiUrl, pedidoParaCriar);
  }

  UpdatePedidoAsync(id: string, editadoPedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, editadoPedido);
  }

  DeletePedidoAsync(id: string): Observable<Pedido[]> {
    return this.http.delete<Pedido[]>(`${this.apiUrl}/${id}`);
  }
}