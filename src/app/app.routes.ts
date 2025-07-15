import { Routes } from '@angular/router';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes';
import { ListaEditar } from './components/lista-editar/lista-editar';


export const routes: Routes = [


  { path: '', component: ListaClientesComponent },
  { path: 'criar', component: ListaEditar },
  { path: 'editar/:id', component: ListaEditar }
];
