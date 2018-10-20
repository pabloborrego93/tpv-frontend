import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantChainComponent } from './restaurant-chain.component';

describe('RestaurantChainComponent', () => {
  let component: RestaurantChainComponent;
  let fixture: ComponentFixture<RestaurantChainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantChainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
