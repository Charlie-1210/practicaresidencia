import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MunicipioEntity } from '../../municipios/entities/municipio.entity.js';

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

  @Column({ nullable: true })
  municipioId: number;

  // Municipio al que pertenece la colonia
  @ManyToOne(() => MunicipioEntity, (municipio) => municipio.colonias)
  @JoinColumn({ name: 'municipioId' })
  municipio: MunicipioEntity;
}
