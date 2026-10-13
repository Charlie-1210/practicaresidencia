import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../../common/decimal.transformer.js';

// Datos del producto (el catálogo de lo que se vende)
@Entity('productos')
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion: string | null;

  // DECIMAL(10,2): hasta 99,999,999.99 con dos decimales exactos.
  // Para dinero se usa DECIMAL y no FLOAT, porque FLOAT redondea mal.
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: decimalTransformer,
  })
  precio: number;
}
