// axios actions
import axios from "./axios";

export async function getSubUsers() {
    const { data } = await axios.get("/subusers");
    return {
        type: "GET_SUBUSERS",
        subUsers: data
    };
}

export async function changeuserType(data) {
    return {
        type: "SET_SUBTYPE",
        userType: data
    };
}

export async function addnewSubUser(data) {
    return {
        type: "ADD_SUBUSER",
        user: data
    };
}

export async function deleteSubUser(data) {
    return {
        type: "DELETE_SUBUSER",
        subUsers: data
    };
}

export async function onlineUsers(users) {
    console.log(users);
    return {
        type: "ONLINE_USERS",
        users
    };
}

export async function userJoined(user) {
    console.log("ONLINE_USERS_ADD");

    return {
        type: "ONLINE_USERS_ADD",
        user
    };
}

export async function userLeft(user) {
    console.log("ONLINE_USERS_REMOVE");
    return {
        type: "ONLINE_USERS_REMOVE",
        user
    };
}

export async function chatMessage(message) {
    return {
        type: "SEND_CHAT_MESSAGE",
        message
    };
}
