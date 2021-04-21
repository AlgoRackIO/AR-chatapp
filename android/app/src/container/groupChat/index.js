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
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { color } from "../../utility";
import styles from "./styles";
import { InputField, ChatBox } from "../../components";
import firebase from "../../firebase/config";
import { senderMsg, recieverMsg } from "../../network";
import { deviceHeight, fieldHeight } from "../../utility/stylehelper/appStyle";
import { smallDeviceHeight, uuid } from "../../utility/constants";
import { MultiPickerMaterialDialog } from 'react-native-material-dialog';
import Dialog from "react-native-dialog";


const groupChat = ({ route, navigation }) => {
    const { params } = route;
    const { groupName, img, allUsers,key } = params;
    const [msgValue, setMsgValue] = useState("");
    const [messeges, setMesseges] = useState();
    const [visible, setVisible] = useState(false);
    const [MultiPickerselectedItems, setSelectedItems] = useState([]);
    const [inviteUsers,setInviteUsers] = useState();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: <Text>{groupName}</Text>,
        });
    }, [navigation]);

    const handleOnChange = (text) => {
        setMsgValue(text);
    };
    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    const invitationSend = () => {
        setVisible(true);
    };

    const addMembers = (result) => {
        setVisible(false)
        result.selectedItems.map(async(selected)=>
         {
             try{
                 return await firebase
                 .database()
                 .ref('groups/' + uuid)
                 .child(key)
                 .push({
                     memberid: selected.id
                 })
             }
             catch(error)
             {
                 return error;
             }
         }) 
    }
 

    return (
        <SafeAreaView style={{ backgroundColor: color.BLACK, flex: 1 }}>
            <View style={styles.container}>
                <SimpleLineIcons
                    name="user-follow"
                    color={color.WHITE}
                    size={25}
                    onPress={invitationSend}
                />
                <Text>
                    <MultiPickerMaterialDialog visible={visible}
                        title={'Invite Members'}
                        items={allUsers.map((row, index) => {
                            return { value: index, label: row.name, id: row.id};
                        })}
                        selectedItems={MultiPickerselectedItems}
                        onCancel={() => setVisible(false)}
                        onOk={result => addMembers(result)}

                    />;
                </Text>
            </View>

            <KeyboardAvoidingView
                keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 70}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ backgroundColor: color.BLACK, flex: 1 }}
            >
                <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={Keyboard.dismiss}
                >

                    <Fragment>
                        <FlatList
                        //   inverted
                        //   data={messeges}
                        //   keyExtractor={(_, index) => index.toString()}
                        //   renderItem={({ item }) => (
                        //     <ChatBox
                        //       msg={item.msg}
                        //       userId={item.sendBy}
                        //       img={item.img}
                        //       onImgTap={() => imgTap(item.img)}
                        //     />
                        //   )}
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
                                //   onPress={() => handleCamera()}
                                />
                                <MaterialCommunityIcons
                                    name="send-circle"
                                    color={color.WHITE}
                                    size={fieldHeight}
                                //   onPress={() => handleSend()}
                                />
                            </View>
                        </View>
                    </Fragment>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default groupChat;