import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import Subusers from "./sublogin";

import { BrowserRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {}
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Link to="/logout">Account Logout</Link>
                    </div>
                </BrowserRouter>
                <Subusers />
                <div className="subusericon">
                    <p>{this.first}</p>
                </div>
            </div>
        );
    }
}
