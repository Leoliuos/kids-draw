import React from "react";
import ReactDOM from "react-dom";

import App from "./app.js";

let elem;

if (location.pathname == "/") {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
