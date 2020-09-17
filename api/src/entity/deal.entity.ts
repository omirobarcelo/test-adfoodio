import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

interface Condition {
  type: string;
  quantity: number;
}

@Entity()
export class DealEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column('varchar')
  name: string | undefined;

  @Column('int')
  price: number | undefined;

  @Column('json')
  conditions: Condition[] | undefined;
}
