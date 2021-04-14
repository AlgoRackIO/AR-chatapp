import React from "react";
import { Image, View, Text } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import styles from "./styles";
import { globalStyle, color } from "../../utility";
import { TouchableOpacity } from "react-native-gesture-handler";
import { app } from "firebase";

const profile = ({ img, name, onImgTap, onEditImgTap }) => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }, styles.container}>
    <View style={styles.imgContainer}>
      <TouchableOpacity onPress={onImgTap} activeOpacity={0.8}>
        {img ? (
          <Image source={{ uri: img }} style={styles.img} resizeMode="cover" />
        ) : (
          <View
            style={
              { justifyContent: 'center', alignItems: 'center' },
              styles.img,
              { backgroundColor: color.DARK_GRAY }
            }
          >
            <Text style={styles.name}>{name.charAt(0)}</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={ { justifyContent: 'center', alignItems: 'center' }, styles.editImgContainer}>
        <FontAwesome5
          name="user-edit"
          size={20}
          onPress={onEditImgTap}
          color={color.WHITE}
        />
      </View>
    </View>
    <Text style={styles.welcome}>{name}</Text>
  </View>
);
export default profile;