import { TestBed, inject } from '@angular/core/testing';

import { SpacesService } from './spaces.service';

describe('SpacesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpacesService]
    });
  });

  it('should be created', inject([SpacesService], (service: SpacesService) => {
    expect(service).toBeTruthy();
  }));
});
