import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HnuLayoutComponent } from './hnu-layout.component';

describe('HnuLayoutComponent', () => {
  let component: HnuLayoutComponent;
  let fixture: ComponentFixture<HnuLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HnuLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HnuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
