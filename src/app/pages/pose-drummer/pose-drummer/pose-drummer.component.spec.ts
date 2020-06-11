import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseDrummerComponent } from './pose-drummer.component';

describe('PoseDrummerComponent', () => {
  let component: PoseDrummerComponent;
  let fixture: ComponentFixture<PoseDrummerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoseDrummerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoseDrummerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
