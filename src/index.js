import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./App";

// We import bootstrap here, but you can remove if you want


// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous"></link>
    <Dapp />
  </React.StrictMode>,
  document.getElementById("root")
);
