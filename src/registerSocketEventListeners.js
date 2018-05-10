import api from './api';
import { prependMessages, addUserToRoom } from './store/actions/messagesActions';

export const onMessageListener = async store => {
  await api.onMessage(result => {
    const message = [
      {
        id: result._id,
        text: result.message,
        time: result.created_at,
        userId: result.userId,
        isMy: store.getState().user.user._id === result.userId,
      },
    ];

    store.dispatch(
      prependMessages({
        roomId: result.roomId,
        messages: message,
      }),
    );

    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    else if (Notification.permission === "granted") {
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
    // store.dispatch(
    //   addUserToRoom({_id: result.userId, roomId: result.roomId})
    // ); 
  });
}
