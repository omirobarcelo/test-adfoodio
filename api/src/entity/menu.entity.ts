import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column('varchar')
  name: string | undefined;

  @Column('int')
  price: number | undefined;

  @Column('varchar')
  type: string | undefined;
}
