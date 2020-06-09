import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { P5PlayComponent } from './p5-play.component';

describe('P5PlayComponent', () => {
  let component: P5PlayComponent;
  let fixture: ComponentFixture<P5PlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P5PlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P5PlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
