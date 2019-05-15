import React from "react";

import axios from "./axios";

import { connect } from "react-redux";

import { getSubUsers, addnewSubUser } from "./actions";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userselected: 0, editname: "placeholder" };
        this.changeSelection = this.changeSelection.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(getSubUsers());
    }
    handleInput(e) {
        e.preventDefault();
        if (!!this.state.passw) {
            axios
                .post("/subregister", {
                    first: this.state.first,
                    passw: this.state.passw,
                    adult: this.state.adult
                })
                .then(data => {
                    this.props.dispatch(addnewSubUser(data));
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ error: "error" });
                });
        } else {
            axios
                .post("/subregister", {
                    first: this.state.first,
                    adult: this.state.adult
                })
                .then(data => {
                    this.props.dispatch(addnewSubUser(data));
                })
                .catch(() => {
                    this.setState({ error: "error" });
                });
        }
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleChangeName(e) {
        this.setState({ editname: e.target.value });
    }
    changeSelection(id, name) {
        this.setState({ userselected: id });
        this.setState({ editname: name });
    }
    render() {
        const { subUsers } = this.props;
        return (
            <div>
                <div className="subuserboxC">
                    <form onSubmit={e => this.handleInput(e)}>
                        <div className="createsubuser">
                            <h1>New</h1>
                            <p>Sub-user :</p>
                            <p>First Name</p>
                            <input
                                name="first"
                                onChange={e => this.handleChange(e)}
                            />
                            <p>
                                Adult user (monitoring)
                                <input
                                    name="adult"
                                    type="checkbox"
                                    onChange={e => this.handleChange(e)}
                                />
                            </p>
                            <p>Sub-user Password (Optional) :</p>
                            <input
                                name="passw"
                                type="password"
                                onChange={e => this.handleChange(e)}
                            />
                            <p />
                            <button>Create</button>
                        </div>
                    </form>
                </div>
                <div className="subuserboxL">
                    <div className="createsubuser">
                        {subUsers.map((user, index) => (
                            <div
                                key={user.id}
                                onClick={() =>
                                    this.changeSelection(
                                        user.id,
                                        user.firstname
                                    )
                                }
                            >
                                <p>{user.firstname}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {this.state.userselected != 0 && (
                    <div className="subuserboxE">
                        <form>
                            <div className="createsubuser">
                                <h1>Edit</h1>
                                <p>Sub-user :</p>
                                <p>First Name</p>
                                <input
                                    name="first"
                                    value={this.state.editname}
                                    onChange={e => this.handleChangeName(e)}
                                />
                                <p>
                                    Adult user (monitoring)
                                    <input name="adult" type="checkbox" />
                                </p>
                                <p>Sub-user Password (Optional) :</p>
                                <input name="passw" type="password" />
                                <p />
                                <button>Edit</button>
                                <button>Delete</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        subUsers: state.subUsers && state.subUsers
    };
}

export default connect(mapStateToProps)(Settings);
