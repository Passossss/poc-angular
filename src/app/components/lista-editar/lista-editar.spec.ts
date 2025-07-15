import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEditar } from './lista-editar';

describe('ListaEditar', () => {
  let component: ListaEditar;
  let fixture: ComponentFixture<ListaEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
