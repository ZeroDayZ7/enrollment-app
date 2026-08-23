import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { CitizenPayload, RegisterCitizenResponse } from '@core/models/citizen.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  private readonly http = inject(HttpClient);

  registerCitizen(payload: CitizenPayload): Observable<RegisterCitizenResponse> {
    return this.http.post<RegisterCitizenResponse>(API_ENDPOINTS.OFFICIAL.CITIZENS.REGISTER, payload);
  }
}