import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueteComponent } from './quete.component';

describe('QueteComponent', () => {
  let component: QueteComponent;
  let fixture: ComponentFixture<QueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
