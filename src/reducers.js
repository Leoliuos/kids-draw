export default function(state = {}, action) {
    if (action.type == "GET_SUBUSERS") {
        state = {
            ...state,
            subUsers: action.subUsers
        };
    }

    if (action.type == "SET_SUBTYPE") {
        state = {
            ...state,
            userType: action.userType.map(user => {
                return user;
            })
        };
    }

    return state;
}
