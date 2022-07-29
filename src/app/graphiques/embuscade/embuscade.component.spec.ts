import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbuscadeComponent } from './embuscade.component';

describe('EmbuscadeComponent', () => {
  let component: EmbuscadeComponent;
  let fixture: ComponentFixture<EmbuscadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbuscadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmbuscadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
