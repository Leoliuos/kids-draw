import React from "react";
import ReactDOM from "react-dom";

import App from "./app.js";
import Welcome from "./welcome.js";

let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
