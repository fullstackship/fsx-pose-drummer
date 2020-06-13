import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundUploaderComponent } from './sound-uploader.component';

describe('SoundUploaderComponent', () => {
  let component: SoundUploaderComponent;
  let fixture: ComponentFixture<SoundUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
