import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconePersonnageComponent } from './icone-personnage.component';

describe('IconePersonnageComponent', () => {
  let component: IconePersonnageComponent;
  let fixture: ComponentFixture<IconePersonnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconePersonnageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconePersonnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
