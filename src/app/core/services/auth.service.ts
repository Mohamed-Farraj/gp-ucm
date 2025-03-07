import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient)

  getApplications()
  {
  //   return {
  //     "success": true,
  //     "message": "All admission requests retrieved successfully",
  //     "data": [
  //         {
  //             "firstName": "محمد",
  //             "userId": 1,
  //             "lastName": "اشرف محمد فراج",
  //             "username": "user777@gmail.com",
  //             "password": null,
  //             "university": {
  //                 "id": 1,
  //                 "name": "Helwan"
  //             },
  //             "nationalId": "12345678901234",
  //             "mobileNumber": "+201234567890",
  //             "faculty": "Engineering",
  //             "level": "Third Year",
  //             "dateOfBirth": "2000-05-15",
  //             "roomId": null,
  //             "studentType": null,
  //             "residenceAddress": "Cairo, Egypt",
  //             "detailedAddress": "Street 10, Nasr City, Apartment 5",
  //             "placeOfBirth": "Cairo",
  //             "gender": "MALE",
  //             "religion": "MUSLIM",
  //             "fatherName": "Mohamed Mahmoud",
  //             "fatherNationalId": "12345678901234",
  //             "fatherOccupation": "Engineer",
  //             "fatherPhoneNumber": "+201112223344",
  //             "guardianName": "Ahmed Mahmoud",
  //             "guardianNationalId": "56789012345678",
  //             "guardianPhoneNumber": "+201155667788",
  //             "parentsStatus": "Married",
  //             "previousAcademicYearGpa": 3.5,
  //             "status": "UNDER_REVIEW",
  //             "housingInPreviousYears": "Yes",
  //             "familyAbroad": false,
  //             "specialNeeds": false,
  //             "secondaryDivision": "Science",
  //             "totalGradesHighSchool": 95.6,
  //             "passportNumber": "A12345678",
  //             "passportIssuingAuthority": "Egyptian Government"
  //         },
  //         {
  //             "firstName": "Ali",
  //             "userId": 2,
  //             "lastName": "Mahmoud",
  //             "username": "user777666@gmail.com",
  //             "password": null,
  //             "university": {
  //                 "id": 1,
  //                 "name": "Helwan"
  //             },
  //             "nationalId": "12345678901235",
  //             "mobileNumber": "+201234567890",
  //             "faculty": "Engineering",
  //             "level": "Third Year",
  //             "dateOfBirth": "2000-05-15",
  //             "roomId": null,
  //             "studentType": null,
  //             "residenceAddress": "Cairo, Egypt",
  //             "detailedAddress": "Street 10, Nasr City, Apartment 5",
  //             "placeOfBirth": "Cairo",
  //             "gender": "MALE",
  //             "religion": "MUSLIM",
  //             "fatherName": "Mohamed Mahmoud",
  //             "fatherNationalId": "12345678901234",
  //             "fatherOccupation": "Engineer",
  //             "fatherPhoneNumber": "+201112223344",
  //             "guardianName": "Ahmed Mahmoud",
  //             "guardianNationalId": "56789012345678",
  //             "guardianPhoneNumber": "+201155667788",
  //             "parentsStatus": "Married",
  //             "previousAcademicYearGpa": 3.5,
  //             "status": "UNDER_REVIEW",
  //             "housingInPreviousYears": "Yes",
  //             "familyAbroad": false,
  //             "specialNeeds": false,
  //             "secondaryDivision": "Science",
  //             "totalGradesHighSchool": 95.6,
  //             "passportNumber": "A12345678",
  //             "passportIssuingAuthority": "Egyptian Government"
  //         }
  //     ]
  // }

  return this._HttpClient.get('http://localhost:8080/admin/admission-requests', { 
    headers: new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZG1vaGFtZWRAZ21haWwuY29tIiwiaWF0IjoxNzQxMzA5MzkyLCJleHAiOjE3NDEzOTU3OTJ9.037oFjjr8tKbqnJZcuSxF4RxRzot4aP8qWQCtPWpcDjnTuwqx80jymAzf6tQliOe',
      'Content-Type': 'application/json'
    })
  });
  }

  DecideArState(UId:number,Status:string){
    return this._HttpClient.put(`http://localhost:8080/admin/admission-requests/${UId}/status?status=${Status}`,
      null,
      {headers: new HttpHeaders({
        'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb2hhbWVkbW9oYW1lZG1vaGFtZWRAZ21haWwuY29tIiwiaWF0IjoxNzQxMzA5MzkyLCJleHAiOjE3NDEzOTU3OTJ9.037oFjjr8tKbqnJZcuSxF4RxRzot4aP8qWQCtPWpcDjnTuwqx80jymAzf6tQliOe',
        'Content-Type': 'application/json',
      }),    
      withCredentials: true 
    },
        );
  }

  setRegisterForm(data:object)
  {
   return this._HttpClient.post('http://localhost:8080/public/register' , data)
  }
  setLoginForm(data:object)
  {
   return this._HttpClient.post('http://localhost:8080/public/login' , data)
  }

}
