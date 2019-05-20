import React from "react";
import axios from "./axios";

import { connect } from "react-redux";

import { getSubUsers, changeuserType } from "./actions";

class Subusers extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: null, passw: null };
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(getSubUsers());
    }
    handleInput(e) {
        e.preventDefault();
        if (!!this.state.passw) {
            axios
                .post("/sublogin", {
                    id: e.target.id,
                    passw: this.state.passw
                })
                .then(resp => {
                    this.props.dispatch(
                        changeuserType([{ userType: resp.data.type }])
                    );
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ error: "error" });
                });
        } else {
            axios
                .post("/sublogin", {
                    id: e.target.id
                })
                .then(resp => {
                    this.props.dispatch(changeuserType([{ userType: 3 }]));
                })
                .catch(() => {
                    this.setState({ error: "error" });
                });
        }
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const { subUsers } = this.props;
        if (!subUsers) {
            return null;
        }
        const subuserlist = (
            <div>
                {this.state.error && (
                    <div className="errortext">Something went wrong!</div>
                )}
                {subUsers.map((user, index) => (
                    <div className="userbox" key={user.id}>
                        <form
                            id={"id_" + user.id}
                            onSubmit={e => this.handleInput(e)}
                        >
                            <label htmlFor={"login-user-" + user.id}>
                                <div className="user">
                                    <h1>{user.firstname}</h1>
                                </div>
                            </label>
                            {user.password && (
                                <div>
                                    <input
                                        type="password"
                                        autoComplete="true"
                                        name="passw"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </div>
                            )}
                            <button
                                id={"login-user-" + user.id}
                                style={{ display: "none" }}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        );
        return <div>{!!subUsers.length && subuserlist}</div>;
    }
}

function mapStateToProps(state) {
    return {
        subUsers: state.subUsers && state.subUsers
    };
}

export default connect(mapStateToProps)(Subusers);
