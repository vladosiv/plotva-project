import { USER_ACTION_TYPES } from '../actions/actionTypes';

export const userReducer = (state = {users: [], selectedUsers: []}, action) => {
  switch (action.type) {
    case USER_ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.user,
      };
      
    case USER_ACTION_TYPES.ADD_USERS: {
      const newUsers = [];
      action.users.forEach(user => {
        if (!state.users.find(item => item._id === user._id)) {
          const status = user.online ? 'online' : 'offline';
          newUsers.push({
              _id: user._id,
              name: user.name,
              img: user.img,
              size: 'small',
              content: status,
              contentType: status,
          });
        }
      })
      return {
        ...state,
        users: [...state.users, ...newUsers]
      };
    }

    case USER_ACTION_TYPES.TOGGLE_USER: {
      const user = action.user;
      const users = [...state.users];
      const selectedUsers = [...state.selectedUsers];
      const userInUsers = users.find(item => item._id === user._id);
      userInUsers.checked = !userInUsers.checked;

      user.checked
      ? selectedUsers.push(user)
      : selectedUsers.splice(selectedUsers.indexOf(user), 1);        

      return {
        ...state,
        users: [...users],
        selectedUsers: [...selectedUsers]
      };

    }

    case USER_ACTION_TYPES.SET_NEXT:
      return {
        ...state,
        next: action.next,
      };
    case USER_ACTION_TYPES.SET_SELECTED:
      return {
        ...state,
        selectedUsers: action.users,
      };

    case USER_ACTION_TYPES.DESELECT_USERS:{
      const users = [...state.users];
      users.forEach(user => {user.checked = false});
      return {
        ...state,
        users: users,
        selectedUsers: []
      };
    }

    default:
      return state;
  }
};
