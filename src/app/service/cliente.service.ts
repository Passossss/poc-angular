import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from '../environments/environments'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = environment.apiUrl + '/clientes';

  constructor(private http: HttpClient) { }

  GetClientesAsync(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  GetClienteByIdAsync(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  CreateClienteAsync(novoCliente: Cliente): Observable<Cliente> {
    const clienteCriar = { ...novoCliente, id: undefined };
    return this.http.post<Cliente>(this.apiUrl, clienteCriar);
  }
  UpdateClienteAsync(editadoCliente: Cliente): Observable<Cliente> {

    return this.http.put<Cliente>(`${this.apiUrl}/${editadoCliente.id}`, editadoCliente);
  }

  DeleteClienteAsync(id: string): Observable<Cliente[]> {
    return this.http.delete<Cliente[]>(`${this.apiUrl}/${id}`);
  }
}