import chai = require("chai");
import chaiHttp = require("chai-http");

import * as dbSetup from "./db-setup";
import { DealEntity } from "./entity/deal.entity";
import { MenuEntity } from "./entity/menu.entity";
import { OrderEntity } from "./entity/order.entity";
import { run } from "./server";
import { DEAL_DATA, MENU_DATA, ORDER_DATA, ORDER_PICK_UP_DATE, SENT_ORDER } from "./server.spec.data";

import sinon = require("sinon");
import typeorm = require("typeorm");

chai.use(chaiHttp);
const { expect } = chai;

const testEndPoint = `http://localhost:4848`;
describe("Integration tests", function () {
  this.beforeAll(function (done) {
    // Stub TypeORM's create connection
    const connectionStub = sinon.stub(typeorm, "createConnection");
    this.createFake = sinon.fake.returns(ORDER_DATA);
    connectionStub.resolves({
      getRepository: (target: Function) => {
        switch (target) {
          case MenuEntity:
            return {
              find: () => MENU_DATA,
            } as any;
          case DealEntity:
            return {
              find: () => DEAL_DATA,
            } as any;
          case OrderEntity:
            return {
              create: this.createFake,
              save: sinon.fake.resolves(ORDER_DATA),
            } as any;
          default:
            return undefined;
        }
      },
    } as any);

    // Stub database initilization
    const dbSetupStub = sinon.stub(dbSetup, "dbSetup");
    dbSetupStub.resolves();

    run()
      .then((server) => {
        this.server = server;
        done();
      })
      .catch((err) => done(err));
  });

  describe("Starting up", function () {
    it("listens to our hacked conf", function () {
      expect(this.server.listening).to.be.true;
    });
  });

  describe("endpoints", function () {
    it("supports main", async function () {
      const res = await chai.request(testEndPoint).get("/").send();
      expect(res).to.have.status(200);
      expect(res).to.be.text;
      expect(res.text).to.equal("Food can be served");
    });

    it("supports menu", async function () {
      const res = await chai.request(testEndPoint).get("/menu").send();
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.eql(MENU_DATA);
    });

    it("supports deal", async function () {
      const res = await chai.request(testEndPoint).get("/deal").send();
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.eql(DEAL_DATA);
    });

    it("supports order", async function () {
      const res = await chai.request(testEndPoint).post("/order").send(SENT_ORDER);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.eql({ pickUpTime: ORDER_PICK_UP_DATE.toISOString() });
    });
  });

  this.afterAll(function () {
    this.server.close((err: Error) => {
      if (err) {
        console.error(err);
      }
      console.log("Closed test server.");
    });
  });
});
