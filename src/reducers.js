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

    if (action.type == "DELETE_SUBUSER") {
        state = {
            ...state,
            subUsers: state.subUsers.map(user => {
                if (user.id != action.id) {
                    return user;
                }
            })
        };
    }

    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            onlineusers: action.users
        };
    }

    if (action.type == "ONLINE_USERS_ADD") {
        state = {
            ...state,
            onlineusers: state.onlineusers.concat(action.user)
        };
    }

    if (action.type == "ONLINE_USERS_REMOVE") {
        state = {
            ...state,
            onlineusers: state.onlineusers.map(user => {
                if (user.id != action.id) {
                    return user;
                }
            })
        };
    }

    if (action.type == "SEND_CHAT_MESSAGE") {
        state = {
            ...state,
            showMessage: action.showMessage.map(user => {
                return user;
            })
        };
    }

    return state;
}
