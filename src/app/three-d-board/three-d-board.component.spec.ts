import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDBoardComponent } from './three-d-board.component';

describe('ThreeDBoardComponent', () => {
  let component: ThreeDBoardComponent;
  let fixture: ComponentFixture<ThreeDBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeDBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeDBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
