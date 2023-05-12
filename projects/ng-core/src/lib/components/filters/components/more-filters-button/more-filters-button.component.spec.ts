import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreFiltersButtonComponent } from './more-filters-button.component';

describe('MoreFiltersButtonComponent', () => {
  let component: MoreFiltersButtonComponent;
  let fixture: ComponentFixture<MoreFiltersButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreFiltersButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreFiltersButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
