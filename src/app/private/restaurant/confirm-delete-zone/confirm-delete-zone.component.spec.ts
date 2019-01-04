import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteZoneComponent } from './confirm-delete-zone.component';

describe('ConfirmDeleteZoneComponent', () => {
  let component: ConfirmDeleteZoneComponent;
  let fixture: ComponentFixture<ConfirmDeleteZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
