import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageShadowPersoComponent } from './image-shadow-perso.component';

describe('ImageShadowPersoComponent', () => {
  let component: ImageShadowPersoComponent;
  let fixture: ComponentFixture<ImageShadowPersoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageShadowPersoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageShadowPersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
