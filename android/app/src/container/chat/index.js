import React, { useLayoutEffect, useState, useEffect, Fragment } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {color} from "../../utility";
import styles from "./styles";
import { InputField, ChatBox } from "../../components";
import firebase from "../../firebase/config";
import { senderMsg, recieverMsg } from "../../network";
import { deviceHeight,fieldHeight } from "../../utility/stylehelper/appStyle";
import { smallDeviceHeight } from "../../utility/constants";

const Chat = ({ route, navigation }) => {
  const { params } = route;
  const { name, img, imgText, guestUserId, currentUserId } = params;
  const [msgValue, setMsgValue] = useState("");
  const [messeges, setMesseges] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: <Text>{name}</Text>,
    });
  }, [navigation]);

  console.log('ids',currentUserId,guestUserId)

  useEffect(() => {
    try {
      firebase
        .database()
        .ref("messeges")
        .child(guestUserId)
        .on("value", (dataSnapshot) => {
          let msgs = [];
          dataSnapshot.forEach((child) => {
              msgs.push({
                sendBy: child.val().sender,
                recievedBy: child.val().reciever,
                msg: child.val().msg,
                img: child.val().img,
              });
          });
          setMesseges(msgs.reverse());
        });
    } catch (error) {
      alert(error);
    }
  }, []);

  const handleSend = () => {
    setMsgValue("");
    if (msgValue) {
      senderMsg(msgValue, currentUserId, guestUserId, "")
        .then(() => {})
        .catch((err) => alert(err));
      recieverMsg(msgValue, currentUserId, guestUserId, "")
        .then(() => {})
        .catch((err) => alert(err));
    }
  };

  const handleCamera = () => {
    const option = {
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(option, (response) => {
      if (response.didCancel) {
        console.log("User cancel image picker");
      } else if (response.error) {
        console.log(" image picker error", response.error);
      } else {

        let source = "data:image/jpeg;base64," + response.data;

        senderMsg(msgValue, currentUserId, guestUserId, source)
          .then(() => {})
          .catch((err) => alert(err));W

        recieverMsg(msgValue, currentUserId, guestUserId, source)
          .then(() => {})
          .catch((err) => alert(err));
      }
    });
  };

  const handleOnChange = (text) => {
    setMsgValue(text);
  };

  //   * On image tap
  const imgTap = (chatImg) => {
    navigation.navigate("ShowFullImg", { name, img: chatImg });
  };
  return (
    <SafeAreaView style={{ backgroundColor: color.BLACK,flex:1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 70}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ backgroundColor: color.BLACK, flex:1 }}
      >
        <TouchableWithoutFeedback
          style={{flex:1}}
          onPress={Keyboard.dismiss}
        >
          <Fragment>
            <FlatList
              inverted
              data={messeges}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <ChatBox
                  msg={item.msg}
                  userId={item.sendBy}
                  img={item.img}
                  onImgTap={() => imgTap(item.img)}
                />
              )}
            />

            {/* Send Message */}
            <View style={styles.sendMessageContainer}>
              <InputField
                placeholder="Type Here"
                numberOfLines={10}
                inputStyle={styles.input}
                value={msgValue}
                onChangeText={(text) => handleOnChange(text)}
              />
              <View style={styles.sendBtnContainer}>
                <MaterialCommunityIcons
                  name="camera"
                  color={color.WHITE}
                  size={fieldHeight}
                  onPress={() => handleCamera()}
                />
                <MaterialCommunityIcons
                  name="send-circle"
                  color={color.WHITE}
                  size={fieldHeight}
                  onPress={() => handleSend()}
                />
              </View>
            </View>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;