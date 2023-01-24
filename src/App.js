import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from "./components/homePage/HomePage";

const App = () => {
  return (
    <BrowserRouter>
      <Route path="*">
        <HomePage />
      </Route>
    </BrowserRouter>
  );
};

export default App;
