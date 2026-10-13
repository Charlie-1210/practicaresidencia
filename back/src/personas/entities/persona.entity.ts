import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VentaEntity } from '../../ventas/entities/venta.entity.js';

// Datos de la persona (el cliente al que se le vende)
@Entity('personas')
export class PersonaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  apellidos: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  telefono: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string | null;

  // Ventas que se le han hecho a esta persona
  @OneToMany(() => VentaEntity, (venta) => venta.persona)
  ventas: VentaEntity[];
}
