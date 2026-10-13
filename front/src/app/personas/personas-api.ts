import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface Persona {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string | null;
  email: string | null;
}

// Lo que se manda al crear o editar (sin id)
export interface GuardarPersonaRequest {
  nombre: string;
  apellidos: string;
  telefono: string | null;
  email: string | null;
}

// Servicio que habla con la API de personas
@Injectable({
  providedIn: 'root',
})
export class PersonasApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/personas`;

  obtenerTodas(search?: string): Observable<Persona[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Persona[]>(this.endpoint, { params });
  }

  crear(persona: GuardarPersonaRequest): Observable<Persona> {
    return this.http.post<Persona>(this.endpoint, persona);
  }

  actualizar(id: number, persona: GuardarPersonaRequest): Observable<Persona> {
    return this.http.patch<Persona>(`${this.endpoint}/${id}`, persona);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
