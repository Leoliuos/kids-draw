import * as io from "socket.io-client";
import { userJoined } from "./actions";

export let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();
        //socket.on("userJoined", user => {
        //    store.dispatch(userJoined(user));
        //});
    }
}
