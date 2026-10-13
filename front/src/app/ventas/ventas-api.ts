import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { Persona } from '../personas/personas-api';
import { Producto } from '../productos/productos-api';

// Una partida (renglón) de la venta como la regresa la API
export interface VentaDetalle {
  id: number;
  productoId: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  personaId: number;
  persona: Persona;
  fecha: string;
  total: number;
  detalles: VentaDetalle[];
}

// Lo que se manda para registrar una venta: la persona y, por cada
// producto, su cantidad. El precio y el total los calcula el back.
export interface CrearVentaRequest {
  personaId: number;
  detalles: { productoId: number; cantidad: number }[];
}

// Servicio que habla con la API de ventas
@Injectable({
  providedIn: 'root',
})
export class VentasApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/ventas`;

  obtenerTodas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.endpoint);
  }

  crear(venta: CrearVentaRequest): Observable<Venta> {
    return this.http.post<Venta>(this.endpoint, venta);
  }
}
