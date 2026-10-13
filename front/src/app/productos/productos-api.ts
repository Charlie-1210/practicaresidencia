import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
}

// Lo que se manda al crear o editar (sin id)
export interface GuardarProductoRequest {
  nombre: string;
  descripcion: string | null;
  precio: number;
}

// Servicio que habla con la API de productos
@Injectable({
  providedIn: 'root',
})
export class ProductosApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/productos`;

  obtenerTodos(search?: string): Observable<Producto[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Producto[]>(this.endpoint, { params });
  }

  crear(producto: GuardarProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.endpoint, producto);
  }

  actualizar(id: number, producto: GuardarProductoRequest): Observable<Producto> {
    return this.http.patch<Producto>(`${this.endpoint}/${id}`, producto);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
