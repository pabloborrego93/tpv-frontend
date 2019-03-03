import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCompositeViewComponent } from './product-composite-view.component';

describe('ProductCompositeViewComponent', () => {
  let component: ProductCompositeViewComponent;
  let fixture: ComponentFixture<ProductCompositeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCompositeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCompositeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
