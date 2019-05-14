import React from "react";

import Registration from "./registration";
import Login from "./login";

import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hideinfo: true, hidepasswordinfo: true };
    }
    hideshowInfo() {
        this.setState({ hideinfo: !this.state.hideinfo });
    }
    hideshowpasswordInfo() {
        this.setState({ hidepasswordinfo: !this.state.hidepasswordinfo });
    }
    render() {
        return (
            <div>
                <div className="yellowLine" />
                <div className="blueLine" />
                <div className="orangeLine" />
                <div className="welcomebox">
                    <h1>Welcome to Kids Draw !</h1>
                    {!this.state.hideinfo && (
                        <div
                            className="siteinfo"
                            onClick={() => this.hideshowInfo()}
                        >
                            <p>
                                Kids Draw is a small safe social network and
                                drawing canvas aimed for parents and children.
                            </p>
                            <p>
                                Your child can send and receive drawings using
                                only friend contacts you have whitelisted.
                            </p>
                            <p>
                                Parents can use the site to chat with other
                                parents or share drawn pictures behind a unique
                                link to, lets say, the other parent at work, or
                                grandparents ...
                            </p>
                        </div>
                    )}
                    {this.state.hideinfo && (
                        <div
                            className="siteinfo"
                            onClick={() => this.hideshowInfo()}
                        >
                            <p className="infotext">Kids Draw - What is it ?</p>
                        </div>
                    )}
                    <HashRouter>
                        <div>
                            <div className="welcomeselectbox">
                                <p>
                                    <Link to="/register" className="infotext">
                                        {"Make a new Account"}
                                    </Link>
                                </p>
                                <p>
                                    <Link to="/login" className="infotext">
                                        Login
                                    </Link>
                                </p>
                            </div>
                            <Route
                                exact
                                path="/register"
                                component={Registration}
                            />
                            <Route path="/login" component={Login} />
                        </div>
                    </HashRouter>
                    {!this.state.hidepasswordinfo && (
                        <div
                            className="siteinfo"
                            onClick={() => this.hideshowpasswordInfo()}
                        >
                            <p>
                                Password is used for all Family members to sign
                                in to the site.
                            </p>
                            <p>However DO NOT use an easy password!</p>
                            <p>
                                Instead use <i>remember passwords</i> for
                                devices or keep the devices logged in.
                            </p>
                            <p>
                                Master Password is your main user password which
                                can be something simpler and is used in cases
                                where you want to set sub-user passwords, reset
                                forgotten passwords and general account
                                configuration.
                            </p>
                        </div>
                    )}
                    {this.state.hidepasswordinfo && (
                        <div
                            className="siteinfo"
                            onClick={() => this.hideshowpasswordInfo()}
                        >
                            <p className="infotext">Password Guide</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
