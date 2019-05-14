import React from "react";

import { connect } from "react-redux";

import { getSubUsers } from "./actions";

class Subusers extends React.Component {
    componentDidMount() {
        this.props.dispatch(getSubUsers());
    }
    render() {
        const { subUsers } = this.props;
        if (!subUsers) {
            return null;
        }
        const subuserlist = (
            <div>
                {subUsers
                    .filter(user => !user.accepted)
                    .map((user, index) => (
                        <div className="user" key={user.id}>
                            {user.first}
                            <div>test result</div>
                        </div>
                    ))}
            </div>
        );
        return <div>{!!subUsers.length && subuserlist}</div>;
    }
}

function mapStateToProps(state) {
    return {
        users: state.subUsers && state.subUsers
    };
}

export default connect(mapStateToProps)(Subusers);
