import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCriar } from './lista-criar';

describe('ListaCriar', () => {
  let component: ListaCriar;
  let fixture: ComponentFixture<ListaCriar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCriar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCriar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
