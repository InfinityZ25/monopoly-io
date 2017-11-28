import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CornerSpaceComponent } from './corner-space.component';

describe('CornerSpaceComponent', () => {
  let component: CornerSpaceComponent;
  let fixture: ComponentFixture<CornerSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CornerSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CornerSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
