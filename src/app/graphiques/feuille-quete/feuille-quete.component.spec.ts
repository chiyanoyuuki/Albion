import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleQueteComponent } from './feuille-quete.component';

describe('FeuilleQueteComponent', () => {
  let component: FeuilleQueteComponent;
  let fixture: ComponentFixture<FeuilleQueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeuilleQueteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeuilleQueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
