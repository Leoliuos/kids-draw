import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {" "}
                <p>funny drawing app! v0.0</p>
            </div>
        );
    }
}
