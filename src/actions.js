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
