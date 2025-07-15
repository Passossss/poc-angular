import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPEditar } from './lista-p-editar';

describe('ListaPEditar', () => {
  let component: ListaPEditar;
  let fixture: ComponentFixture<ListaPEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
