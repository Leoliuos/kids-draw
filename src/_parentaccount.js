import React from "react";
import axios from "./axios";

export default class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return <div className="databox">hello wolrd</div>;
    }
}
