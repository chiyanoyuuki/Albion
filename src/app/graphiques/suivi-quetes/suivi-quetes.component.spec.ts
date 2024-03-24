import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviQuetesComponent } from './suivi-quetes.component';

describe('SuiviQuetesComponent', () => {
  let component: SuiviQuetesComponent;
  let fixture: ComponentFixture<SuiviQuetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviQuetesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviQuetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
