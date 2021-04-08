import React, { useState, useContext } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import firebase from "../../firebase/config";
import { InputField, RoundCornerButton, Logo } from "../../components";
import {color } from "../../utility";
import {globalStyle,appStyle} from "../../utility/stylehelper"
import { Store } from "../../context/store";
import { LOADING_START, LOADING_STOP } from "../../context/actions/type";
import { setAsyncStorage, keys } from "../../asyncStorage";
import {
  setUniqueValue,
  keyboardVerticalOffset,
} from "../../utility/constants";
import { SignUpRequest, AddUser } from "../../network";

export default ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [logo, toggleLogo] = useState(true);
  const { email, password, confirmPassword, name } = credential;

  const setInitialState = () => {
    setCredential({ email: "", password: "", confirmPassword: "" });
  };

  //   * ON SIGN UP PRESS
  const onSignUpPress = () => {
    Keyboard.dismiss();
    if (!name) {
      alert("Name is required");
    } else if (!email) {
      alert("Email is required");
    } else if (!password) {
      alert("Password is required");
    } else if (password !== confirmPassword) {
      alert("Password did not match");
    } else {
      dispatchLoaderAction({
        type: LOADING_START,
      });
      SignUpRequest(email, password)
        .then((res) => {
          if (!res.additionalUserInfo) {
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            alert(res);
            return;
          }
          let uid = firebase.auth().currentUser.uid;
          let profileImg = "";
          AddUser(name, email, uid, profileImg)
            .then(() => {
              setAsyncStorage(keys.uuid, uid);
              setUniqueValue(uid);
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
              navigation.replace("Dashboard");
            })
            .catch((err) => {
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
              alert(err);
            });
        })
        .catch((err) => {
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          alert(err);
        });
    }
  };
  const handleOnChange = (name, value) => {
    setCredential({
      ...credential,
      [name]: value,
    });
  };
  const handleFocus = () => {
    setTimeout(() => {
      toggleLogo(false);
    }, 200);
  };
  // * ON INPUT BLUR

  const handleBlur = () => {
    setTimeout(() => {
      toggleLogo(true);
    }, 200);
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ backgroundColor: color.BLACK,flex:1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, backgroundColor: color.BLACK }}>
          {logo && (
            <View style={{    justifyContent: 'center',
            alignItems: 'center',
            flex: 1,}}>
              <Logo />
            </View>
          )}

          <View style={ { justifyContent: 'center', alignItems: 'center',flex:2 }}>
            <InputField
              placeholder="Enter name"
              value={name}
              onChangeText={(text) => handleOnChange("name", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter email"
              value={email}
              onChangeText={(text) => handleOnChange("email", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => handleOnChange("password", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Confirm Password"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={(text) => handleOnChange("confirmPassword", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />

            <RoundCornerButton
              title="Sign Up"
              onPress={() => onSignUpPress()}
            />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: color.LIGHT_GREEN,
              }}
              onPress={() => {
                setInitialState();
                navigation.navigate("Login");
              }}
            >
              Login
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};