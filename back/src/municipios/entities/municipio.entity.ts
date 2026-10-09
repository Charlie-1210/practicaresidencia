import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ColoniaEntity } from '../../colonias/entities/colonia.entity.js';

// Datos del municipio
@Entity('municipios')
export class MunicipioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  activo: boolean;

  // Colonias del municipio
  @OneToMany(() => ColoniaEntity, (colonia) => colonia.municipio)
  colonias: ColoniaEntity[];
}
