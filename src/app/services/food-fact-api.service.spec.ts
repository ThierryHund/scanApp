import { TestBed } from '@angular/core/testing';

import { FoodFactApiService } from './food-fact-api.service';

describe('FoodFactApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodFactApiService = TestBed.get(FoodFactApiService);
    expect(service).toBeTruthy();
  });
});
