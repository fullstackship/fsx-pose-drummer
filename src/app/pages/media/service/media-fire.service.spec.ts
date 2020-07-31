import { TestBed } from '@angular/core/testing';

import { MediaFireService } from './media-fire.service';

describe('MediaFireService', () => {
  let service: MediaFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
