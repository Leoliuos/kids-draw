import * as io from "socket.io-client";
import { userJoined } from "./actions";
// or this file

export let socket;

export function init(store) {
    if (!socket) {
        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });
    }
}
