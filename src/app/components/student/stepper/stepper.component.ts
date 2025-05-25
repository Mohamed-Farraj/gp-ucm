import { CdkStepper } from '@angular/cdk/stepper';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [NgFor ,NgIf, NgTemplateOutlet],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  providers:[{provide:CdkStepper,useExisting:StepperComponent}]
})
export class StepperComponent extends CdkStepper {


  @Input() linearModeSelected = true;

  onClick(index:number){
    this.selectedIndex = index;
  }


}
