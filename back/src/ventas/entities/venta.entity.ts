import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { PersonaEntity } from '../../personas/entities/persona.entity.js';
import { VentaDetalleEntity } from './venta-detalle.entity.js';
import { decimalTransformer } from '../../common/decimal.transformer.js';

// Encabezado de la venta: a quién se le vendió, cuándo y por cuánto
@Entity('ventas')
export class VentaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  personaId: number;

  // Persona a la que se le hizo la venta (muchas ventas -> una persona)
  @ManyToOne(() => PersonaEntity, (persona) => persona.ventas, {
    nullable: false,
  })
  @JoinColumn({ name: 'personaId' })
  persona: Relation<PersonaEntity>;

  // La base de datos pone la fecha y hora sola al guardar
  @CreateDateColumn()
  fecha: Date;

  // Suma de los subtotales de todas las partidas
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: decimalTransformer,
  })
  total: number;

  // Partidas de la venta (una venta -> muchas partidas).
  // cascade: al guardar la venta se guardan también sus partidas
  @OneToMany(() => VentaDetalleEntity, (detalle) => detalle.venta, {
    cascade: ['insert'],
  })
  detalles: VentaDetalleEntity[];
}
