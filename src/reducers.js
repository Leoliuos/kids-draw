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

    if (action.type == "ADD_SUBUSER") {
        state = {
            ...state,
            subUsers: state.subUsers.concat(action.user)
        };
    }

    return state;
}
