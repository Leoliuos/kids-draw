import React from "react";
import axios from "./axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                passw: this.state.passw,
                masterpassw: this.state.masterpassw
            })
            .then(() => {
                location.replace("/");
            })
            .catch(() => {
                this.setState({ error: "error" });
            });
    }
    render() {
        const handleInput = e => {
            this.setState({ [e.target.name]: e.target.value });
        };
        return (
            <div className="databox">
                {this.state.error && (
                    <div className="errortext">Something went wrong!</div>
                )}
                <div>
                    <p>
                        First Name
                        <input name="first" onChange={handleInput} />
                    </p>
                    <p>
                        Last Name
                        <input name="last" onChange={handleInput} />
                    </p>
                    <p>
                        Email
                        <input name="email" onChange={handleInput} />
                    </p>
                    <p>
                        Password
                        <input
                            name="passw"
                            onChange={handleInput}
                            type="password"
                        />
                    </p>
                    <p>
                        Master Password
                        <input
                            name="masterpassw"
                            onChange={handleInput}
                            type="password"
                        />
                    </p>
                </div>
                <button onClick={e => this.submit()}>Join up</button>
            </div>
        );
    }
}
