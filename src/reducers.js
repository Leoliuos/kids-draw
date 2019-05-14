export default function(state = {}, action) {
    if (action.type == "GET_SUBUSERS") {
        state = {
            ...state,
            subUsers: action.subUsers
        };
    }

    return state;
}
