import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageCropperComponent } from './product-image-cropper.component';

describe('ProductImageCropperComponent', () => {
  let component: ProductImageCropperComponent;
  let fixture: ComponentFixture<ProductImageCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImageCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
