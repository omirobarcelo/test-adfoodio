import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

interface Order {
  menuId: number,
  quantity: number
}

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column('json')
  order: Order[] | undefined;

  @Column('int')
  price: number | undefined;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  pickUpTime: Date | undefined;
}
