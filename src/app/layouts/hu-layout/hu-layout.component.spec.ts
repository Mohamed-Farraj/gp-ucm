import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuLayoutComponent } from './hu-layout.component';

describe('HuLayoutComponent', () => {
  let component: HuLayoutComponent;
  let fixture: ComponentFixture<HuLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
