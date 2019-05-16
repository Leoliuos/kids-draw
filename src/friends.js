import React from "react";

import axios from "./axios";

import { connect } from "react-redux";

import { getSubUsers } from "./actions";

class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.dispatch(getSubUsers());
    }
    handleInputMakeKey(e, id) {
        e.preventDefault();
        axios
            .post("/friends/generatekey", {
                makepassw: this.state.makepassw,
                id: id
            })
            .then(data => {
                this.setState({
                    error: null,
                    success1: "true",
                    success2: null
                });
            })
            .catch(err => {
                this.setState({ error: "error" });
            });
    }

    handleInputSetKey(e, id) {
        e.preventDefault();
        axios
            .post("/friends/enterkey", {
                passw: this.state.passw,
                uid: this.state.uid,
                id: id
            })
            .then(data => {
                this.setState({
                    error: null,
                    success1: null,
                    success2: "true"
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ error: err });
            });
    }

    listenChangeMake(e) {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({
            error: null,
            success1: null,
            success2: null
        });
    }
    listenChangeSet(e) {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({
            error: null,
            success1: null,
            success2: null
        });
    }
    render() {
        const { subUsers } = this.props;
        return (
            <div>
                <p>
                    Here you can let your child message to other children by
                    sharing the friendship key along with a password of your
                    choise to the other parents. You can change password at any
                    time but note that you need to inform those parties who have
                    not yet made connection with the details.
                </p>
                <p>
                    Only share these details with people who you know and have
                    met in real life.
                </p>
                <div className="friendshipbox">
                    <div className="fcontainershort">Sub user name :</div>
                    <div className="fcontainer">Friendship key :</div>
                    <div className="fcontainer">Password :</div>
                </div>
                {this.state.error && (
                    <div className="failure">Something went wrong!</div>
                )}
                {this.state.success1 && <div className="success">Success!</div>}
                {subUsers
                    .filter(user => user.type == 3)
                    .map((user, index) => (
                        <div key={user.id} className="friendshipbox">
                            <form
                                onSubmit={e =>
                                    this.handleInputMakeKey(e, user.id)
                                }
                            >
                                <div className="fcontainershort">
                                    {user.firstname}
                                </div>
                                <div className="fcontainer">
                                    {user.friendshipkey}
                                </div>
                                <div className="fcontainer">
                                    <input
                                        type="password"
                                        name="makepassw"
                                        onChange={e => this.listenChangeMake(e)}
                                    />
                                </div>
                                <div className="fcontainershort">
                                    <button>Change</button>
                                </div>
                            </form>
                        </div>
                    ))}
                <p>
                    If you have received friendship keys and password, you can
                    enter them here for each child separately that you think
                    should be allowed to message given child.
                </p>
                <div className="friendshipbox">
                    <div className="fcontainershort">Sub user name :</div>
                    <div className="fcontainer">Friendship key :</div>
                    <div className="fcontainer">Password :</div>
                </div>
                {this.state.error && (
                    <div className="failure">
                        Insert valid friendship keys and passwords. Sub users
                        may already be connected ?
                    </div>
                )}
                {this.state.success2 && <div className="success">Success!</div>}
                {subUsers
                    .filter(user => user.type == 3)
                    .map((user, index) => (
                        <div key={user.id} className="friendshipbox">
                            <form
                                onSubmit={e =>
                                    this.handleInputSetKey(e, user.id)
                                }
                            >
                                <div className="fcontainershort">
                                    {user.firstname}
                                </div>
                                <div className="fcontainer" name="findkey">
                                    <input
                                        name="uid"
                                        onChange={e => this.listenChangeSet(e)}
                                    />
                                </div>
                                <div className="fcontainer">
                                    <input
                                        type="password"
                                        name="passw"
                                        onChange={e => this.listenChangeSet(e)}
                                    />
                                </div>
                                <div className="fcontainershort">
                                    <button>Connect</button>
                                </div>
                            </form>
                        </div>
                    ))}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        subUsers: state.subUsers && state.subUsers
    };
}

export default connect(mapStateToProps)(Friends);
