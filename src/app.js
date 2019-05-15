import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import Subusers from "./sublogin";

import Master from "./masteraccount";
import Parent from "./parentaccount";
import World from "./childaccount";

import { connect } from "react-redux";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { userType } = this.props;
        if (!userType) {
            return (
                <div>
                    <div>
                        <a href="/logout">Account Logout</a>
                    </div>
                    <Subusers />
                </div>
            );
        } else if (userType[0].userType === 1) {
            return (
                <div>
                    <div>
                        <a href="/logout">Account Logout</a>
                    </div>
                    <Master />
                </div>
            );
        } else if (userType[0].userType === 2) {
            return (
                <div>
                    <div>
                        <a href="/logout">Account Logout</a>
                    </div>
                    <Parent />
                </div>
            );
        } else if (userType[0].userType === 3) {
            return (
                <div>
                    <World />
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        userType: state.userType && state.userType
    };
}

export default connect(mapStateToProps)(App);
