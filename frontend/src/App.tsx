import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { Menu } from "./components/Menu";
import { Order } from "./components/Order";
import logo from "./logo.png";
import { StateProvider } from "./store";

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
    <StateProvider>
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
    </StateProvider>
  );
}

export default App;
