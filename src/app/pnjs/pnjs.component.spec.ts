import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnjsComponent } from './pnjs.component';

describe('PnjsComponent', () => {
  let component: PnjsComponent;
  let fixture: ComponentFixture<PnjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PnjsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PnjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
