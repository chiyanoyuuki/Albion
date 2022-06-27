import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContextuelComponent } from './menu-contextuel.component';

describe('MenuContextuelComponent', () => {
  let component: MenuContextuelComponent;
  let fixture: ComponentFixture<MenuContextuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuContextuelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuContextuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
