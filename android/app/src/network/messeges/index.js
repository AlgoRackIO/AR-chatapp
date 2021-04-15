import firebase from '../../firebase/config';
const senderMsg = async (msgValue, currentUserId, guestUserId, img) => {
  try {
    console.log('Idsssssssssssssssssssss',currentUserId,guestUserId)
    return await firebase
      .database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
          reciever: guestUserId,
          msg: msgValue,
          img: img,
      });
  } catch (error) {
    return error;
  }
};

const recieverMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  img,
) => {
  try {
    return await firebase
      .database()
      .ref('messeges/' + guestUserId)
      .child(currentUserId)
      .push({
          sender: currentUserId,
          msg: msgValue,
          img: img,
      });
  } catch (error) {
    return error;
  }
};
export {senderMsg,recieverMsg};