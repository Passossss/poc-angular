import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes';
import { ListaEditar } from './components/lista-editar/lista-editar';
import { ListaPedidos } from './components/lista-pedidos/lista-pedidos';
import { ListaPEditar } from './components/lista-p-editar/lista-p-editar';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'clientes', component: ListaClientesComponent },
  { path: 'criar', component: ListaEditar },
  { path: 'editar/:id', component: ListaEditar },
  { path: 'pedidos', component: ListaPedidos },
  { path: 'pedidos/criar', component: ListaPEditar },
  { path: 'pedidos/editar/:id', component: ListaPEditar }
];
