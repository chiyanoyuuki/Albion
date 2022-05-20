import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandeUniteComponent } from './bande-unite.component';

describe('BandeUniteComponent', () => {
  let component: BandeUniteComponent;
  let fixture: ComponentFixture<BandeUniteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandeUniteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandeUniteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
