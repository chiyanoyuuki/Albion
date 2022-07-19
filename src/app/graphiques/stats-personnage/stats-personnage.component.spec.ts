import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsPersonnageComponent } from './stats-personnage.component';

describe('StatsPersonnageComponent', () => {
  let component: StatsPersonnageComponent;
  let fixture: ComponentFixture<StatsPersonnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsPersonnageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsPersonnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
