import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroHelperComponent } from './hero-helper.component';

describe('HeroHelperComponent', () => {
  let component: HeroHelperComponent;
  let fixture: ComponentFixture<HeroHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroHelperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
