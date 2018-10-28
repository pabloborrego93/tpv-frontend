import { TestBed } from '@angular/core/testing';

import { ProductFamilyService } from './product-family.service';

describe('ProductFamilyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductFamilyService = TestBed.get(ProductFamilyService);
    expect(service).toBeTruthy();
  });
});
