import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntiteComponent } from './add-entite.component';

describe('AddEntiteComponent', () => {
  let component: AddEntiteComponent;
  let fixture: ComponentFixture<AddEntiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEntiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEntiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
