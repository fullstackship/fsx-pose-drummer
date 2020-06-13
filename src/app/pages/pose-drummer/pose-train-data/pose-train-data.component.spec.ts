import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseTrainDataComponent } from './pose-train-data.component';

describe('PoseTrainDataComponent', () => {
  let component: PoseTrainDataComponent;
  let fixture: ComponentFixture<PoseTrainDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoseTrainDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoseTrainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
