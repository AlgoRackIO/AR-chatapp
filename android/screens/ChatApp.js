import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity, Alert,
  FlatList
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore'
import { useEffect } from "react";



export default ChatApp = () => {


  useEffect(()=>{
    firestore()
    .collection('messages')
    .get()
    .then(querySnapshot => {
      var messages = []
      querySnapshot.forEach(documentSnapshot => {
        messages.push(documentSnapshot.data())
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.....................',documentSnapshot);
      });
      setMessages(messages);
    });
  },[]);

  const [text,setText] = useState();
  const [messages,setMessages] = useState();
  // const messages = [{messageOwner: 'peter', message: 'Hi!', time: '3:00 am'},{messageOwner: 'john', message: 'Hello!', time: '3:00 am'}]

  return (
    <View style={styles.container}>
      <View style={styles.flatList}>
      <FlatList
      data={messages}
      style={{width:'100%'}}
      renderItem={({ item }) => (
        <View style={styles.messageView}>
        <Text style={styles.messageTextColor}>{item.name}</Text>
        <Text style={styles.messageOwnerText}>{item.message}</Text>
        <Text></Text>
        {/* <Text style={styles.messageTime}>{item.time}</Text> */}
    </View>
      )}/>
      </View>
      <View style={styles.bottombar}>
        <View style={styles.bottombarContent}>
          <View style={styles.textInputFieldView}>
            <TextInput
            style={styles.textInputField}
            onChangeText={(text)=>{setText(text)}}
            value={text}
            />
          </View>
          <View style={styles.SendbtnView}>
            <View style={styles.Sendbtn}>
                <Text style={{color:'white',letterSpacing:1}}>Send</Text>
            </View>
          </View>
        </View>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottombar: {
    position: "absolute",
    height: '8%',
    width: '100%',
    backgroundColor: 'grey',
    bottom: 0
  },
  bottombarContent: {
    flex: 8,
    flexDirection: 'row'
  },
 
  Sendbtn: {
   backgroundColor: '#3a9fbf',
   height:'70%',
   width:'80%',
   borderRadius: 8,
   justifyContent:'center',
   alignItems:'center',
  },
  SendbtnView:{
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
textInputFieldView:{
  flex:6,
  justifyContent:"center",
  alignItems:"center"
},
  textInputField:{
    height: '70%',
    width: '95%',
    backgroundColor:'white',
    borderRadius:8
  },
  flatList:{
    width:'100%',
    height:'92%',
    alignItems:'center'
  },
  messageView:{
    width: '75%',
    backgroundColor: 'grey',
    padding: '2%',
    borderRadius:5,
    marginTop:'5%',
    alignSelf:'center'
  },
  messageTextColor:{
    color:'purple'
  },
  messageOwnerText:{
    color:'white'
  },
  messageTime:{
    color:'#444444',
    position: 'absolute',
    bottom:0,
    right:0,
    padding:'1.5%'
  }


});
