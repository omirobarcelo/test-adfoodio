import { Connection, DeepPartial } from "typeorm";
import { DealEntity } from "./entity/deal.entity";
import { MenuEntity } from "./entity/menu.entity";

const menu: {
  [key: string]: { name: string; price: number }[];
} = require("./../menu.json");

interface Menu {
  name: string;
  price: number;
  type: string;
}

/**
 * Initializes Menu and Deal tables
 * @param connection
 */
export async function dbSetup(connection: Connection) {
  // Get database repositories
  const menuRepository = connection.getRepository(MenuEntity);
  const dealRepository = connection.getRepository(DealEntity);

  // Iterate over menu item types and create the entities
  const menus: DeepPartial<MenuEntity>[] = Object.entries(menu).reduce(
    (acc, [key, items]) => [
      ...acc,
      ...items.map((item) => ({
        name: item.name,
        price: item.price,
        type: key,
      })),
    ],
    [] as Menu[]
  );
  const menuEntities = menuRepository.create(menus);
  await menuRepository.save(menuEntities);

  // Create the deal entity
  const dealEntity = dealRepository.create({
    name: "Hungry Date Offer",
    price: 4000,
    conditions: [
      { type: "main", quantity: 2 },
      { type: "drink", quantity: 2 },
      { type: "dessert", quantity: 1 },
    ],
  });
  await dealRepository.save(dealEntity);
}
