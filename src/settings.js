import React from "react";

import axios from "./axios";

import { connect } from "react-redux";

import { getSubUsers, addnewSubUser } from "./actions";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userselected: 0,
            editname: "placeholder",
            delete: false
        };
        this.changeSelection = this.changeSelection.bind(this);
        this.handleChangeEdit = this.handleChangeEdit.bind(this);
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
                    this.props.dispatch(addnewSubUser([data.data]));
                })
                .catch(err => {
                    this.setState({ error: err });
                });
        } else {
            axios
                .post("/subregister", {
                    first: this.state.first,
                    adult: this.state.adult
                })
                .then(data => {
                    this.props.dispatch(addnewSubUser([data.data]));
                })
                .catch(err => {
                    this.setState({ error: err });
                });
        }
    }
    handleInputSubEdit(e) {
        e.preventDefault();
        if (!!this.state.editpassw) {
            axios
                .post("/subedit", {
                    first: this.state.editname,
                    passw: this.state.editpassw,
                    adult: this.state.editadult,
                    id: this.state.userselected,
                    delete: this.state.delete
                })
                .then(data => {
                    if (!data.deleted) {
                        this.props.dispatch(getSubUsers());
                        this.setState({ userselected: 0 });
                    } else {
                        this.props.dispatch(deleteSubUser(data));
                        this.setState({ userselected: 0 });
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ error: "error" });
                });
        } else {
            axios
                .post("/subedit", {
                    first: this.state.editname,
                    adult: this.state.editadult,
                    id: this.state.userselected,
                    delete: this.state.delete
                })
                .then(data => {
                    if (!data.deleted) {
                        this.props.dispatch(getSubUsers());
                        this.setState({ userselected: 0 });
                    } else {
                        this.props.dispatch(deleteSubUser(data));
                        this.setState({ userselected: 0 });
                    }
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
        this.setState({ error: null });
    }
    handleChangeEdit(e) {
        if (e.target.name != "delete") {
            this.setState({ [e.target.name]: e.target.value });
        } else {
            this.setState({ [e.target.name]: e.target.checked });
        }
    }
    render() {
        const { subUsers } = this.props;
        return (
            <div>
                {this.state.error && (
                    <div className="errortext">
                        Something went wrong! You must use unique names for each
                        user.
                    </div>
                )}
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
                        {subUsers
                            .filter(user => user.type != 1)
                            .map((user, index) => (
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
                        <form onSubmit={e => this.handleInputSubEdit(e)}>
                            <div className="createsubuser">
                                <h1>Edit</h1>
                                <p>Sub-user :</p>
                                <p>First Name</p>
                                <input
                                    name="first"
                                    value={this.state.editname}
                                    onChange={e => this.handleChangeName(e)}
                                />
                                {!this.state.delete && (
                                    <div>
                                        <p>
                                            Adult user (monitoring)
                                            <input
                                                name="editadult"
                                                type="checkbox"
                                                onChange={e =>
                                                    this.handleChangeEdit(e)
                                                }
                                            />
                                        </p>
                                        <p>Sub-user Password (Optional) :</p>
                                        <input
                                            name="editpassw"
                                            type="password"
                                            onChange={e =>
                                                this.handleChangeEdit(e)
                                            }
                                        />
                                    </div>
                                )}
                                <p />
                                Delete this user
                                <input
                                    name="delete"
                                    type="checkbox"
                                    onChange={e => this.handleChangeEdit(e)}
                                />
                                <p />
                                <button>Edit</button>
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
