import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFamilyComponent } from './product-family.component';

describe('ProductFamilyComponent', () => {
  let component: ProductFamilyComponent;
  let fixture: ComponentFixture<ProductFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
