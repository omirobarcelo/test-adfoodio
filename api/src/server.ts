import express from "express";
import { createConnection } from "typeorm";
import { dbSetup } from "./db-setup";
import { DealEntity } from "./entity/deal.entity";
import { MenuEntity } from "./entity/menu.entity";
import { OrderEntity } from "./entity/order.entity";

const port = process.env.NODE_PORT || 4848;

export async function run() {
  // Create connection to database and initialize it
  const connection = await createConnection();
  await dbSetup(connection);

  // Get repositories to query and update the tables
  const menuRepository = connection.getRepository(MenuEntity);
  const dealRepository = connection.getRepository(DealEntity);
  const orderRepository = connection.getRepository(OrderEntity);

  const app = express();
  app.use(express.json());

  app.get("/", function (_, res) {
    res.type("text/plain").send("Food can be served");
  });

  // Get menu items
  app.get("/menu", async function (_, res) {
    const menu = await menuRepository.find();
    res.send(menu);
  });

  // Get deals
  app.get("/deal", async function (_, res) {
    const deal = await dealRepository.find();
    res.send(deal);
  });

  // Create an order and return the waiting time
  // req.body in shape { order: { menuId: number; quantity: number }[]; price: number }
  app.post("/order", async function (req, res) {
    const orderEntity = orderRepository.create({
      order: req.body.order,
      price: req.body.price,
      waitTime: req.body.order.length * 2,
    });
    const order = await orderRepository.save(orderEntity);
    return res.send({ waitTime: order.waitTime });
  });

  return app.listen(port, function () {
    // Port is forwarded by docker to 80.
    console.log(`Listening on http://localhost:${port}`);
  });
}

if (process.env.NODE_ENV !== "testing") {
  run();
}
