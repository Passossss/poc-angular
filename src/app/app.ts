import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaClientesComponent } from "./components/lista-clientes/lista-clientes";

@Component({
  selector: 'app-root',
  imports: [ ListaClientesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'poc-angular';
}
