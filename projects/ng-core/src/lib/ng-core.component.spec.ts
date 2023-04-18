import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCoreComponent } from './ng-core.component';

describe('NgCoreComponent', () => {
  let component: NgCoreComponent;
  let fixture: ComponentFixture<NgCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgCoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
