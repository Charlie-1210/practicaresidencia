import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { VentaEntity } from './venta.entity.js';
import { ProductoEntity } from '../../productos/entities/producto.entity.js';
import { decimalTransformer } from '../../common/decimal.transformer.js';

// Una partida (renglón) de la venta: qué producto, cuántos y a qué precio
@Entity('venta_detalles')
export class VentaDetalleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  ventaId: number;

  // Si se borra la venta, se borran sus partidas.
  // Relation<> evita un error de importación circular entre venta y partida
  @ManyToOne(() => VentaEntity, (venta) => venta.detalles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ventaId' })
  venta: Relation<VentaEntity>;

  @Column({ nullable: false })
  productoId: number;

  @ManyToOne(() => ProductoEntity, { nullable: false })
  @JoinColumn({ name: 'productoId' })
  producto: Relation<ProductoEntity>;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  // Se guarda el precio del momento de la venta: si después el producto
  // cambia de precio, la venta conserva el precio con el que se vendió
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: decimalTransformer,
  })
  precioUnitario: number;

  // cantidad x precioUnitario
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: decimalTransformer,
  })
  subtotal: number;
}
