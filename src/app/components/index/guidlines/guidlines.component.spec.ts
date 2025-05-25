import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidlinesComponent } from './guidlines.component';

describe('GuidlinesComponent', () => {
  let component: GuidlinesComponent;
  let fixture: ComponentFixture<GuidlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidlinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuidlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
