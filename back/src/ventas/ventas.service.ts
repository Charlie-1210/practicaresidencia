import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { VentaEntity } from './entities/venta.entity.js';
import { VentaDetalleEntity } from './entities/venta-detalle.entity.js';
import { PersonaEntity } from '../personas/entities/persona.entity.js';
import { ProductoEntity } from '../productos/entities/producto.entity.js';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(VentaEntity)
    private readonly repositorioVentas: Repository<VentaEntity>,
    @InjectRepository(PersonaEntity)
    private readonly repositorioPersonas: Repository<PersonaEntity>,
    @InjectRepository(ProductoEntity)
    private readonly repositorioProductos: Repository<ProductoEntity>,
  ) {}

  // Registrar una venta
  async create(createVentaDto: CreateVentaDto): Promise<VentaEntity> {
    // 1. La persona debe existir
    const persona = await this.repositorioPersonas.findOne({
      where: { id: createVentaDto.personaId },
    });
    if (!persona) {
      throw new NotFoundException(
        `No existe la persona con id ${createVentaDto.personaId}`,
      );
    }

    // 2. Todos los productos deben existir (se buscan de una sola vez)
    const ids = [...new Set(createVentaDto.detalles.map((d) => d.productoId))];
    const productos = await this.repositorioProductos.find({
      where: { id: In(ids) },
    });
    const faltantes = ids.filter((id) => !productos.some((p) => p.id === id));
    if (faltantes.length > 0) {
      throw new NotFoundException(
        `No existen los productos con id: ${faltantes.join(', ')}`,
      );
    }

    // 3. Armar las partidas con el precio del catálogo y calcular el total.
    //    Las cuentas se hacen en centavos (enteros) para no perder decimales.
    let totalCentavos = 0;
    const detalles = createVentaDto.detalles.map((linea) => {
      const producto = productos.find((p) => p.id === linea.productoId)!;
      const precioCentavos = Math.round(producto.precio * 100);
      const subtotalCentavos = precioCentavos * linea.cantidad;
      totalCentavos += subtotalCentavos;

      const detalle = new VentaDetalleEntity();
      detalle.productoId = producto.id;
      detalle.cantidad = linea.cantidad;
      detalle.precioUnitario = precioCentavos / 100;
      detalle.subtotal = subtotalCentavos / 100;
      return detalle;
    });

    // 4. Guardar la venta; por el cascade también se guardan las partidas
    const venta = this.repositorioVentas.create({
      personaId: persona.id,
      total: totalCentavos / 100,
      detalles,
    });
    const guardada = await this.repositorioVentas.save(venta);

    // 5. Regresar la venta completa (con persona y productos)
    return this.findOne(guardada.id);
  }

  // Listar ventas, de la más reciente a la más antigua
  findAll(): Promise<Array<VentaEntity>> {
    return this.repositorioVentas.find({
      relations: { persona: true, detalles: { producto: true } },
      order: { id: 'DESC' },
    });
  }

  // Buscar venta por id con su persona y sus partidas
  async findOne(id: number): Promise<VentaEntity> {
    const venta = await this.repositorioVentas.findOne({
      where: { id },
      relations: { persona: true, detalles: { producto: true } },
    });
    if (!venta) {
      throw new NotFoundException(`No existe la venta con id ${id}`);
    }
    return venta;
  }
}
