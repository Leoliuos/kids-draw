import React from "react";
import axios from "./axios";

import { connect } from "react-redux";

class World extends React.Component {
    constructor(props) {
        super(props);
        this.state = { imageskey: null, picindex: 0 };
    }
    componentDidMount() {
        axios
            .get("/view/images")
            .then(data => {
                this.setState({
                    imageskey: data.data.imageskey,
                    picindex: data.data.picindex
                });
            })
            .catch(() => {
                this.setState({ error: "error" });
            });
    }
    render() {
        if (!this.props.users) {
            return (
                <div className="circus">
                    <a href="/draw">
                        <div className="tabularasa" />
                    </a>
                    {rows.map(i => (
                        <div key={i}>
                            <a href={"/draw/" + this.state.imageskey + "/" + i}>
                                <img
                                    className="drawing"
                                    src={localStorage.getItem(
                                        this.state.imageskey + i
                                    )}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            );
        }
        var rows = [],
            i = 0,
            len = this.state.picindex;
        while (++i <= len) rows.push(i);
        return (
            <div className="circus">
                <a href="/draw">
                    <div className="tabularasa" />
                </a>
                {rows.map(i => (
                    <div key={i}>
                        <a href={"/draw/" + this.state.imageskey + "/" + i}>
                            <img
                                className="drawing"
                                src={localStorage.getItem(
                                    this.state.imageskey + i
                                )}
                            />
                        </a>
                    </div>
                ))}
                {!!this.props.users.length &&
                    this.props.users.map((user, index) => (
                        <div key={index}>{user}</div>
                    ))}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.onlineusers && state.onlineusers
    };
}

export default connect(mapStateToProps)(World);
