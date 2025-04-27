import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  constructor() { }
  private readonly _HttpClient = inject(HttpClient)


  mealForm(data:object) :Observable <any>
  {
     return this._HttpClient.post(`${environment.baseUrl}/admin/edit/add-meals`,data);
  }

  updateMeal(id:number,data:object):Observable<any>
  {
    return this._HttpClient.put(`${environment.baseUrl}/admin/edit/update-meal/${id}`,data);
  }

  deleteMeal(id:number):Observable<any>
  {
    return this._HttpClient.delete(`${environment.baseUrl}/admin/delete-meal/${id}`);
  }


  getAllMeals():Observable<any>
  {
    return this._HttpClient.get(`${environment.baseUrl}/admin/edit/get-meals`);
  }
}
