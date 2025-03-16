import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService {

  private baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  // Helper to create headers
  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ----------------------
  // Building APIs
  // ----------------------

  /**
   * Create a new building.
   * Endpoint: POST /admin/add-buildings
   */
  addBuilding(request: any): Observable<any> {
    
    const url = `${this.baseUrl}/admin/add-buildings`;
    return this.http.post(url, request, { headers: this.createHeaders() });
  }

  getAllBuildings(universityId: number): Observable<any> {
    const url = `${this.baseUrl}/public/get-buildings/${universityId}`;
    // In a public endpoint you may not require the token but add it if necessary
    return this.http.get(url, { headers: this.createHeaders() });
  }

  /**
   * Delete a building by universityId and buildingId.
   * Endpoint: DELETE /admin/delete-building?universityId={universityId}&buildingId={buildingId}
   */
  deleteBuilding(universityId: number, buildingId: number): Observable<any> {
    const url = `${this.baseUrl}/admin/delete-building?universityId=${universityId}&buildingId=${buildingId}`;
    return this.http.delete(url, { headers: this.createHeaders() });
  }

  // ----------------------
  // Room APIs
  // ----------------------

  /**
   * Create a new room.
   * Endpoint: POST /admin/rooms/add
   */
  addRoom(dto: any): Observable<any> {
    const url = `${this.baseUrl}/admin/rooms/add`;
    return this.http.post(url, dto, { headers: this.createHeaders() });
  }

  /**
   * Get all rooms for a specific building.
   * Endpoint: GET /public/rooms/getAll/{buildingId}
   */
  getAllRooms(buildingId: number): Observable<any> {
    const url = `${this.baseUrl}/public/rooms/getAll/${buildingId}`;
    return this.http.get(url, { headers: this.createHeaders() });
  }

  /**
   * Delete a room by buildingId and roomId.
   * Endpoint: DELETE /admin/rooms/delete?buildingId={buildingId}&roomId={roomId}
   */
  deleteRoom(buildingId: number, roomId: number): Observable<any> {
    const url = `${this.baseUrl}/admin/rooms/delete?buildingId=${buildingId}&roomId=${roomId}`;
    return this.http.delete(url, { headers: this.createHeaders() });
  }

  
}
