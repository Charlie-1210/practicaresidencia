import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Datos de la colonia
@Entity('colonias')
export class ColoniaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  codigoPostal: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  activo: boolean;
}
