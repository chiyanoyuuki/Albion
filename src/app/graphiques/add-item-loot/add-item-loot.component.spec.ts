import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemLootComponent } from './add-item-loot.component';

describe('AddItemLootComponent', () => {
  let component: AddItemLootComponent;
  let fixture: ComponentFixture<AddItemLootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemLootComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemLootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
