import React from "react";

import Friends from "./friends";
import Monitor from "./monitor";
import Settings from "./settings";

export default class Master extends React.Component {
    constructor(props) {
        super(props);
        this.state = { menuopen: "settings" };
    }
    render() {
        const handleInput = e => {
            this.setState({ menuopen: e.target.id });
        };
        return (
            <div className="topmenu">
                <div
                    className="menuselect"
                    id="friends"
                    onClick={e => handleInput(e)}
                >
                    Friends
                </div>
                <div
                    className="menuselect"
                    id="settings"
                    onClick={e => handleInput(e)}
                >
                    Settings
                </div>
                {this.state.menuopen == "friends" && <Friends />}
                {this.state.menuopen == "settings" && <Settings />}
            </div>
        );
    }
}
