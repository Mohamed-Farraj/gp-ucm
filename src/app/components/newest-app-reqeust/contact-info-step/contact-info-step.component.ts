import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-info-step',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-info-step.component.html',
  styleUrl: './contact-info-step.component.scss'
})
export class ContactInfoStepComponent {
  @Input() formGroup!: FormGroup;
  @Input() countriesList: any[] = []; // لاستقبال قائمة الدول
  @Input() governoratesList: any[] = []; // لاستقبال قائمة المحافظات المفلترة
  @Input() citiesList: any[] = []; // لاستقبال قائمة المدن المفلترة
  @Input() currentCountryCode: string | null = null; // لاستقبال الدولة المختارة حالياً
  @Input() currentGovernorateId: string | null = null; // غير النوع إلى string | null

get country() { return this.formGroup?.get('country'); }
get governorate() { return this.formGroup?.get('governorate'); }
get city() { return this.formGroup?.get('city'); }
get detailedAddress() { return this.formGroup?.get('detailedAddress'); }
get mobileNumber() { return this.formGroup?.get('mobileNumber'); }
get username() { return this.formGroup?.get('username'); }


get shouldShowGovernorate(): boolean {
  return this.currentCountryCode === 'EG';
}

get shouldShowCity(): boolean {
  return this.shouldShowGovernorate && 
         this.currentGovernorateId !== null && 
         this.currentGovernorateId !== undefined; // Or check for a valid ID > 0 etc.
}

 get isGovernorateDisabled(): boolean {
    return !this.governoratesList || this.governoratesList.length === 0;
 }

 get isCityDisabled(): boolean {
   return !this.citiesList || this.citiesList.length === 0;
 }
}
