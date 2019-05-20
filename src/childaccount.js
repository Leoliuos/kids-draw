import React from "react";
import axios from "./axios";

import { connect } from "react-redux";

import { socket } from "./socket";

class World extends React.Component {
    constructor(props) {
        super(props);
        this.state = { imageskey: null, picindex: 0, messenger: false };
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
    sendmsg(e) {
        e.preventDefault();
        socket.emit("chatMessage", {
            target: this.state.targetid,
            message: this.state.message
        });
        this.setState({ messenger: false });
    }

    handleChange(e) {
        this.setState({ message: e.target.value });
        console.log(this.props.messages);
    }
    closeopen() {
        this.setState({ messenger: !this.state.messenger });
    }
    open(name, id) {
        this.setState({ messenger: true, targetid: id, messengername: name });
    }
    render() {
        var rows = [],
            i = 0,
            len = this.state.picindex;
        while (++i <= len) rows.push(i);
        if (!this.props.users) {
            return (
                <div className="circus">
                    <a href="/draw">
                        <div className="tabularasa" />
                    </a>
                    {rows.map(i => (
                        <div key={i}>
                            <a
                                href={
                                    "/draw/" +
                                    this.state.imageskey +
                                    "/" +
                                    (this.state.picindex - i + 1)
                                }
                            >
                                <img
                                    className="drawing"
                                    src={localStorage.getItem(
                                        this.state.imageskey +
                                            (this.state.picindex - i + 1)
                                    )}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="circus">
                <div className="imageslist">
                    <a href="/draw">
                        <div className="tabularasa" />
                    </a>
                    {rows.map(i => (
                        <div key={i}>
                            <a
                                href={
                                    "/draw/" +
                                    this.state.imageskey +
                                    "/" +
                                    (this.state.picindex - i + 1)
                                }
                            >
                                <img
                                    className="drawing"
                                    src={localStorage.getItem(
                                        this.state.imageskey +
                                            (this.state.picindex - i + 1)
                                    )}
                                />
                            </a>
                        </div>
                    ))}
                </div>
                <div className="usersonline">
                    {!!this.props.users.length &&
                        this.props.users.map((user, index) => (
                            <div
                                key={index}
                                className="useronline"
                                onClick={() => this.open(user.name, user.id)}
                            >
                                {user.name}
                            </div>
                        ))}
                </div>
                {this.state.messenger == true && (
                    <div className="sendmessage">
                        <form onSubmit={e => this.sendmsg(e)}>
                            <div className="sendtext">Send Message to</div>
                            <div
                                className="sendx"
                                onClick={e => this.closeopen()}
                            >
                                X
                            </div>
                            <div className="sendtextto">
                                {this.state.messengername}
                            </div>
                            <input
                                name="message"
                                id="messagefield"
                                onChange={e => this.handleChange(e)}
                            />
                            <button>Send</button>
                        </form>
                    </div>
                )}
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
