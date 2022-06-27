import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosEntiteComponent } from './infos-entite.component';

describe('InfosEntiteComponent', () => {
  let component: InfosEntiteComponent;
  let fixture: ComponentFixture<InfosEntiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosEntiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosEntiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
