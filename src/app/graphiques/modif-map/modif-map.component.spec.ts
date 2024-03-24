import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifMapComponent } from './modif-map.component';

describe('ModifMapComponent', () => {
  let component: ModifMapComponent;
  let fixture: ComponentFixture<ModifMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
