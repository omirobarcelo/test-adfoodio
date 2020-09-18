import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { CartComponent } from "./components/Cart";
import { MenuComponent } from "./components/Menu";
import { Order } from "./components/Order";
import logo from "./logo.png";
import { StateProvider } from "./store";

function App() {
  return (
    <StateProvider>
      <CssBaseline />
      <div className="App">
        <Router>
          <AppBar position="static" className="App-header">
            <Toolbar>
              <Typography variant="h6">
                <Link to="/" data-testid="home-link">
                  <img src={logo} className="App-logo" alt="logo" />
                </Link>
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth={false} className="App-container">
            <Switch>
              <Route path="/order">
                <Order />
              </Route>
              <Route path="/">
                <div className="Menu-container">
                  <MenuComponent />
                </div>
                <div className="Cart-container">
                  <CartComponent />
                </div>
              </Route>
            </Switch>
          </Container>
        </Router>
      </div>
    </StateProvider>
  );
}

export default App;
