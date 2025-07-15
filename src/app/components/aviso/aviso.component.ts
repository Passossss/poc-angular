import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aviso',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="mensagem" [ngClass]="tipo === 'erro' ? 'aviso-erro' : 'aviso-sucesso'">
      {{ mensagem }}
      <div class="mt-3">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .aviso-erro {
      background: #ffdddd;
      color: #a94442;
      border: 1px solid #a94442;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 18px;
      text-align: center;
      font-weight: 600;
    }
    .aviso-sucesso {
      background: #d4edda;
      color: #155724;
      border: 1px solid #155724;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 18px;
      text-align: center;
      font-weight: 600;
    }
  `]
})
export class AvisoComponent {
  @Input() mensagem: string = '';
  @Input() tipo: 'erro' | 'sucesso' = 'erro';
} 