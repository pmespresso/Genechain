import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes";
import "./App.css";
import { hot } from 'react-hot-loader';

const App = () => {
  return (
    <Switch>
      {routes.map((route, i) => <Route key={i} {...route} />)}
    </Switch>
  );
};

export default hot(module)(App);
