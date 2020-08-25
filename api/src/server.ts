import express from "express";

const port = process.env.NODE_PORT || 3000;

function run () {
  const app = express();

  app.get("/", function(req, res) {
    res.send("Food can be served")
  });

  app.listen(port, function () {
    // Port is forwarded by docker to 80.
    console.log(`Listening on http://localhost:${port}`);
  })
}

run();
