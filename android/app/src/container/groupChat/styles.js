import { StyleSheet } from "react-native";
import { color, appStyle } from "../../utility";
import {fieldHeight} from "../../utility/stylehelper/appStyle"

export default StyleSheet.create({
  sendMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  input: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    width: "70%",
  },

  sendBtnContainer: {
    height:fieldHeight,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    width: "29%",
  },
});