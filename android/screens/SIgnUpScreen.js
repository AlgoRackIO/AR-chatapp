import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import auth from "@react-native-firebase/auth"
 
export default LoginScreen=({navigation})=> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doCreateUser = async () =>{
    try {
     let response =  await auth().createUserWithEmailAndPassword(email, password);
      if(response){
        console.log(response)
      }
    } catch (e) {
      console.error(e.message);
    }
  }
    const doSignUp = () => {
      if (!email) {
        setError("Email required *")
        setValid(false)
        return
      } else if (!password && password.trim() && password.length > 6) {
        setError("Weak password, minimum 5 chars")
        setValid(false)
        return
      }
    
      doCreateUser(email, password)
    }
 
  return (
    <View style={styles.container}> 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"

          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity style={styles.SignUpBtn}
      onPress={()=>doSignUp()}
       >
        <Text style={styles.loginText}>SignUp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn}
      onPress={() => {navigation.navigate('LoginScreen')} }
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
  
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
 
  image: {
    marginBottom: 40,
  },
 
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
 
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },

  SignUpBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#FF1493",
  },
});