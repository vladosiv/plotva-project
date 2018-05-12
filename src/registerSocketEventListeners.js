import api from './api';
import { prependMessages } from './store/actions/messagesActions';
import { addUsers } from './store/actions/userActions';

export const onMessageListener = async store => {
  await api.onMessage(async result => {
    const message = [
      {
        id: result._id,
        text: result.message,
        time: result.created_at,
        userId: result.userId,
        isMy: store.getState().user.user._id === result.userId,
      },
    ];

    const user = store.getState().user.user;
    const users = store.getState().user.users;
    let lastMessageUserName;

    if (result.userId === user._id){
      lastMessageUserName = 'You: '
    } else {
      let lastMessageUser = users.find(user => user._id === result.userId);
      if (result.userId && !lastMessageUser) {
        lastMessageUser = await api.getUser(result.userId);
        store.dispatch(addUsers([lastMessageUser]));
      } 
      lastMessageUserName = `${lastMessageUser.name}: `
    }

    store.dispatch(
      prependMessages({
        roomId: result.roomId,
        messages: message,
        lastMessageUserName
      }),
    );


    if (Notification.permission === "granted") {
      new Notification("New Message", {body: result.message, icon: '/favicon.ico'});
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          new Notification("You will recieve notifications.");
        }
      });
    }
  })
}

export const onJoinRoomListener = async store => {
  await api.onUserJoinedRoom(result => {
    console.log(result);
    // store.dispatch(
    //  addUserToRoom({_id: result.userId, roomId: result.roomId})
    // ); 
  });
}

export const onLeaveRoomListener = async store => {
  await api.onUserLeavedRoom(result => {
    console.log(result);
    // store.dispatch(
    //  addUserToRoom({_id: result.userId, roomId: result.roomId})
    // ); 
  });
}
