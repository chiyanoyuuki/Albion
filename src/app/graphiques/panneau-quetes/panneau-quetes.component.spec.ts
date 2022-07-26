import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneauQuetesComponent } from './panneau-quetes.component';

describe('PanneauQuetesComponent', () => {
  let component: PanneauQuetesComponent;
  let fixture: ComponentFixture<PanneauQuetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanneauQuetesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanneauQuetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
