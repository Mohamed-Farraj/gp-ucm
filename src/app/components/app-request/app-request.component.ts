import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-app-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app-request.component.html',
})
export class AppRequestComponent  {

  AppRequest : FormGroup = new FormGroup({
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    username: new FormControl(null),//emails
    password: new FormControl(null),
    role: new FormControl("USER"),
    universityId: new FormControl("1"),
    nationalId: new FormControl(null),
    mobileNumber: new FormControl(null),
    faculty: new FormControl(null),
    level: new FormControl(null),
    dateOfBirth: new FormControl(null),
    residenceAddress: new FormControl(null),
    detailedAddress: new FormControl(null),
    placeOfBirth: new FormControl(null),
    gender: new FormControl(null),
    religion: new FormControl(null),
    fatherName: new FormControl(null),
    fatherNationalId: new FormControl(null),
    fatherOccupation: new FormControl(null),
    fatherPhoneNumber: new FormControl(null),
    guardianName: new FormControl(null),
    guardianNationalId: new FormControl(null),
    guardianPhoneNumber: new FormControl(null),
    parentsStatus: new FormControl(null),
    previousAcademicYearGpa: new FormControl(null),
    status: new FormControl(null),
    housingInPreviousYears: new FormControl(null),
    familyAbroad: new FormControl(null),
    specialNeeds: new FormControl(null),
    secondaryDivision: new FormControl(null),
    totalGradesHighSchool: new FormControl(null),
    passportNumber: new FormControl(null),
    passportIssuingAuthority: new FormControl(null),



  })


  
  
}
