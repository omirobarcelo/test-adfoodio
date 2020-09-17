import React from "react";
import logo from "./logo.png";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Order } from "./components/Order";
import { Menu } from "./components/Menu";

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Welcome! And good luck! :)<br/>Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //     </header>
  //   </div>
  // );
  return (
    <div className="App">
      <Router>
        <header style={{ width: "100%", height: "15%" }}>
          <Link to="/">
            <img src={logo} style={{ height: "64px" }} alt="logo" />
          </Link>
        </header>
        <div style={{ width: "100%", height: "85%" }}>
          <Switch>
            <Route path="/order">
              <Order />
            </Route>
            <Route path="/">
              <Menu />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
