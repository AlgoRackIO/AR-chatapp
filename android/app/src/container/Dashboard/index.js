import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { SafeAreaView, Alert, Text, View, FlatList,StyleSheet } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import ImagePicker from "react-native-image-picker";
import { Profile, StickyHeader } from "../../components";
import firebase from "../../firebase/config";
import { color } from "../../utility";
import { Store } from "../../context/store";
import { LOADING_STOP, LOADING_START } from "../../context/actions/type";
import { uuid, smallDeviceHeight } from "../../utility/constants";
import { clearAsyncStorage } from "../../asyncStorage";
import { deviceHeight, deviceWidth } from "../../utility/stylehelper/appStyle";
import { UpdateUser, LogOutUser } from "../../network";
import {RoundCornerButton} from '../../components';
import { MultiPickerMaterialDialog } from 'react-native-material-dialog';
import Dialog from "react-native-dialog";
import {ShowUsers,Showgroups} from "../../components/showUserAndGroups";
import profile from "../../components/profile";
import { Dimensions } from "react-native";



const Dashboard =  ({ navigation }) => {

  const [key,setkey] = useState();
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState; 
  const [visible, setVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [userDetail, setUserDetail] = useState({
    id: "",
    name: "",
    profileImg: "",
  });

  const [getScrollPosition, setScrollPosition] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllgroups] = useState([]);
  const { profileImg, name } = userDetail;
  let guestIDs = [];
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SimpleLineIcons
          name="logout"
          size={26}
          color={color.WHITE}
          style={{ right: 10 }}
          onPress={() =>
            Alert.alert(
              "Logout",
              "Are you sure to log out",
              [
                {
                  text: "Yes",
                  onPress: () => logout(),
                },
                {
                  text: "No",
                },
              ],
              { cancelable: false }
            )
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    dispatchLoaderAction({
      type: LOADING_START,
    });
    try {
      firebase
        .database()
        .ref("users")
        .on("value", (dataSnapshot) => {
          let users=[];
          let currentUser = {
            id: "",
            name: "",
            profileImg: "",
          };
          dataSnapshot.forEach((child) => {
            if (uuid === child.val().uuid) {
              currentUser.id = uuid;
              currentUser.name = child.val().name;
              currentUser.profileImg = child.val().profileImg;
              if (child.val().groups){
                setAllgroups(Object.entries(child.val().groups))
              }
            } else {
              users.push({
                id: child.val().uuid,
                name: child.val().name,
                profileImg: child.val().profileImg,
              });
            }
          });
          setUserDetail(currentUser);
          setAllUsers(users);
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
        });
    } catch (error) {
      alert(error);
      dispatchLoaderAction({
        type: LOADING_STOP,
      });
    }
  }, []);
 
  const selectPhotoTapped = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = "data:image/jpeg;base64," + response.data;
        dispatchLoaderAction({
          type: LOADING_START,
        });
        UpdateUser(uuid, source)
          .then(() => {
            setUserDetail({
              ...userDetail,
              profileImg: source,
            });
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
          })
          .catch(() => {
            alert(err);
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
          });
      }
    });
  };
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAdd = async() => {
    try{
      let t = await firebase
      .database()
      .ref('groups/')
      .push({
        name: groupName,
        participants:[uuid]
      })
      t.once("value",async (snap)=>{
        await firebase
        .database()
        .ref('users/' + uuid + "/groups/"+snap.val().name)
        .set( {groupid:t.key, })
        setVisible(false);
      })
     
      setGroupName("");
    }
    catch (error) {
      return error;
    }
  };
  const logout = () => {
    LogOutUser()
      .then(() => {
        clearAsyncStorage()
          .then(() => {
            navigation.replace("Login");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(err));
  };

  const imgTap = (profileImg, name) => {
    if (!profileImg) {
      navigation.navigate("ShowFullImg", {
        name,
        imgText: name.charAt(0),
      });
    } else {
      navigation.navigate("ShowFullImg", { name, img: profileImg });
    }       <TouchableOpacity style={[styles.logoContainer]} onPress={onImgTap}>
    {img ? (
      <Thumbnail source={{ uri: img }} resizeMode="cover" />
    ) : (
      <Text style={styles.thumbnailName}>{groupName.charAt(0)}</Text>
    )}
  </TouchableOpacity>
  };
  const nameTap = (profileImg, name, guestUserId) => {
    if (!profileImg) {
      navigation.navigate("Chat", {
        name,
        imgText: name.charAt(0),
        guestUserId,
        currentUserId: uuid,
      });
    } else {
      navigation.navigate("Chat", {
        name,
        img: profileImg,
        guestUserId,
        currentUserId: uuid,
      });
    }
  };
  const groupChatTap = (groupName,guestUserId=[]) => {
    if (!profileImg) {
      navigation.navigate("groupChat", {
        allUsers,
        groupName,
        // guestUserId,
        // imgText: groupName[0].charAt(0),
      });
    } else {
      navigation.navigate("groupChat", {
        // allUsers,
        groupName,
        guestUserId,
        // img: profileImg,
      });
    }
  }
  
  const getOpacity = () => {
    if (deviceHeight < smallDeviceHeight) {
      return deviceHeight / 4;
    } else {
      return deviceHeight / 6;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.BLACK }}>
       <Profile
              img={profileImg}
              onImgTap={() => imgTap(profileImg, name)}
              onEditImgTap={() => selectPhotoTapped()}
              name={name}
            />
      <Text style={{color:'white',fontSize:20}}>Direct</Text>
      <FlatList
        alwaysBounceVertical={false}
        data={allUsers}
        keyExtractor={(_, index) => index.toString()}
        onScroll={(event) =>
          setScrollPosition(event.nativeEvent.contentOffset.y)
        }
        style={{height:Dimensions.get('screen').height* 0.25}}
        renderItem={({ item }) => (
          <ShowUsers
            name={item.name}
            img={item.profileImg}
            onImgTap={() => imgTap(item.profileImg, item.name)}
            onNameTap={() => nameTap(item.profileImg, item.name,item.id)}
          />
        )}
      />
      <Text style={{color:'white',fontSize:20}}>Groups</Text>
        <FlatList
        style={{height:Dimensions.get('screen').height* 0.3, marginBottom:80}}
        alwaysBounceVertical={false}
        data={allGroups}
        keyExtractor={(_, index) => index.toString()}
        onScroll={(event) =>
          setScrollPosition(event.nativeEvent.contentOffset.y)
        }
        renderItem={({ item }) => {
          return (
        <Showgroups
            groupName={item[0]}
            // img={profileImg}
            // onImgTap={() => imgTap(item.profileImg,   item.groupname)}
            onNameTap={() => groupChatTap(item,guestIDs)}
          />
        )}}
      />
        <View style={styles.container}>
      <RoundCornerButton title="Add Group" onPress={showDialog} />
      <Dialog.Container visible={visible}>
        <Dialog.Title>Add Group</Dialog.Title>
        <Dialog.Input
        label="Group Name" 
        value={groupName}
        onChangeText={(value) => setGroupName(value)}
        ></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Add" onPress={handleAdd} />
      </Dialog.Container>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Dashboard;