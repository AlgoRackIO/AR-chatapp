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
import { version } from "@babel/core";
import user from "../../network/user";


const groupChat = ({ route, navigation }) => {
    const { params } = route;
    const { groupName, guestUserId,allUsers } = params;
    const [msgValue, setMsgValue] = useState("");
    const [messeges, setMesseges] = useState();
    const [visible, setVisible] = useState(false);
    const [Mvisible, setMVisible] = useState(false);
    const [MultiPickerselectedItems, setSelectedItems] = useState([]);
    const [selectedMembers, setselectedMembers] = useState([]);
    const [Members,setMembers] = useState();
    const [inviteUsers,setInviteUsers] = useState();
    const [Users,setUsers] = useState();
    const groupId = Object.values(groupName[1])[0]
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: <Text>{groupName[0]}</Text>,
        });
    }, [navigation]);

    const currentUserId = uuid;
    useEffect(() => {
        try {
            const users = new Set()

          firebase
            .database()
            .ref("groups/" + groupId)
            .on("value", (dataSnapshot) => {
                try {
                    if(dataSnapshot.val().participants && Object.values(dataSnapshot.val().participants).length>0){
                        let array = Object.values(dataSnapshot.val().participants)
                        for (let index = 0; index < array.length; index++) {
                            const child = array[index];
                            users.add(child)
                        }
                    }
                } catch (error) {
                    
                }
            });
            let inviteUsers=[]
            let mem=[]
            let selected=[]
            allUsers.map((row, index) => {
                if (!users.has(row.id))
                    inviteUsers.push( { value: index, label: row.name, id: row.id})
                else{
                    mem.push({ value: index, label: row.name, id: row.id})
                    selected.push({value: index})
                }
            })
            setUsers(users)
            setMembers(mem)
            setselectedMembers(selected)
            setInviteUsers(inviteUsers)
          firebase
            .database()
            .ref("messeges/" + groupId)
            .on("value", (dataSnapshot) => {
                let msgs = [];
                dataSnapshot.forEach((child) => {
                    msgs.push({
                    sendBy: child.val().sender,
                    //   recievedBy: child.val().reciever,
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
    const showMembers = () => {
        setMVisible(true);
    };

    const addMembers = (result) => {
        setVisible(false)
        let users = new Set(Users)
        
        result.selectedItems.map(async(selected)=>
         {
            if (!users.has(selected.id))
                users.add(selected.id)
             try{
                await firebase
                .database()
                .ref('users/' + selected.id + "/groups/"+groupName[0])
                .set( {groupid:groupId})
                await firebase
                .database()
                .ref('groups/' + groupId +"/participants")
                .push(selected.id)
             }
             catch(error)
             {
                 return error;
             }
         }) 
         let inviteUsers=[]
         let mem=[]
         let selected=[]

         allUsers.map((row, index) => {
             if (!users.has(row.id))
                 inviteUsers.push( { value: index, label: row.name, id: row.id})
            else{
                mem.push( { value: index, label: row.name, id: row.id, selected:true})
                selected.push({value: index})
}
         })
         setselectedMembers(selected)
         setInviteUsers(inviteUsers)
         setMembers(mem)

    }
    const handleSend = () => {
        setMsgValue("");
        if (msgValue) {
        //   senderMsg(msgValue, groupId, guestUserId, "")
        //     .then(() => {})
        //     .catch((err) => alert(err));
          recieverMsg(msgValue, currentUserId, groupId, "")
            .then(() => {})
            .catch((err) => alert(err));
        }
      };
    return (
        <SafeAreaView style={{ backgroundColor: color.BLACK, flex: 1 }}>
            <View style={{flexDirection:'row'}}>
                <View style={styles.container}>
                    <SimpleLineIcons
                        name="user-follow"
                        color={color.WHITE}
                        size={25}
                        onPress={invitationSend}
                    />
                    
                </View>
                <View style={{marginLeft:20}}>
                    <SimpleLineIcons
                            name="people"
                            color={color.WHITE}
                            size={25}
                            onPress={showMembers}
                        />
                  
                </View>
                <Text>
                    <Dialog.Container visible={Mvisible}>
                        <Dialog.Title>Members</Dialog.Title>
                        
                        {(Members)?Members.map((d)=>{
                            console.log(d)
                            return(<Text style={{fontSize:15, marginVertical:5}}>
                                    {d.label}
                                </Text>)
                        
                        }):null}
                        <Dialog.Button label="Cancel" onPress={() => setMVisible(false)} />
                    </Dialog.Container>
                    </Text>
                <Text>
                    <MultiPickerMaterialDialog visible={visible}
                        title={'add Members'}
                        items={inviteUsers}
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
                                //   onPress={() => handleCamera()}
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


export default groupChat;