import React from "react";

import { connect } from "react-redux";

import { getSubUsers } from "./actions";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.dispatch(getSubUsers());
    }
    render() {
        const { subUsers } = this.props;
        return (
            <div>
                <div className="subuserboxC">
                    <form>
                        <div className="createsubuser">
                            <p>Create a new Sub-user :</p>
                            <p>First Name</p>
                            <input name="firstname" />
                            <p>
                                Adult user (monitoring)
                                <input name="adult" type="checkbox" />
                            </p>
                            <p>Sub-user Password (Optional) :</p>
                            <input name="password" type="password" />
                            <p />
                            <button>Create</button>
                        </div>
                    </form>
                </div>
                <div className="subuserboxL">
                    <div className="createsubuser">
                        {subUsers.map((user, index) => (
                            <div key={user.id}>
                                <p>{user.firstname}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="subuserboxE">
                    <form>
                        <div className="createsubuser">
                            <p>Edit Sub-user :</p>
                            <p>First Name</p>
                            <input name="firstname" />
                            <p>
                                Adult user (monitoring)
                                <input name="adult" type="checkbox" />
                            </p>
                            <p>Sub-user Password (Optional) :</p>
                            <input name="password" type="password" />
                            <p />
                            <button>Edit</button>
                        </div>
                    </form>
                </div>
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
