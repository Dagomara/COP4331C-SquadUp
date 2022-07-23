import {ActivityIndicator,Alert, SafeAreaView,ScrollView,View,Text,Image,Button,StyleSheet} from 'react-native';
import{authorize} from 'react-native-app-auth';
//import{dcLogin} from './discordLogin.js';
const clientId = require("./../config.json").CLIENT_ID;
const port = require("./../config.json").PORT;
import * as React from 'react';
import axios from 'axios';

import getProfile from './components/getProfile';




//axios.method('url', data(if needed), {withCredentials: true})

function HomePage(){



   let avatarLink = "https://cdn.discordapp.com/avatars/"+global.data.discordID+"/"+global.data.avatar+".png"

   let status = require('./assets/red.png')

   if(global.data.status == 'online')
   {
       status = require('./assets/online.png')
   }



    //Alert.alert("response",JSON.stringify(data,null,2));

  return (
      <View style={styles.container}>
         <View style={styles.headerBox}></View>

        <View style={styles.profilePic}>
               <Image
                style={styles.image}
                source={{uri: avatarLink }}
               />
        </View>

        <View style={styles.status}>
            <Image
              style={styles.statusIcon}
              source= {status}
            />
        </View>

        <View style={styles.userInfoBox}>
              <Text style={styles.unText}> @{global.data.username} </Text>
              <Text style={styles.tag}> #{global.data.tag}</Text>
        </View>

        <View style={styles.gameList}>
            <Text style={styles.listTitle}> My Games </Text>
        </View>


      </View>
    );
}

    const styles = StyleSheet.create({
     container: {
        backgroundColor: '#333333',
     },

     profilePic: {
        flex:1,
        marginTop: 0,
        //backgroundColor: 'violet',
        paddingTop: 80,
        alignItems: 'center',

     },

     unText:{
        color:'white',
        fontSize: 30,
        fontFamily:'Roboto',
     },
     tag: {
        position: 'relative',
        alignSelf:'center',
        fontSize: 15,
        color:'white',
     },
     image:{
          width: 180,
          height: 180,
          borderRadius: 93,
          borderWidth: 4,
          borderColor: "purple",
          marginBottom:10,
          alignSelf:'center',
          justifyContent:'flex-end',
          position: 'absolute',
          marginTop:-100,
          zIndex: 1,
     },
     headerBox: {
        height: 130,
        backgroundColor: 'purple',
     },
     userInfoBox: {
        position: 'relative',
        alignSelf:'center',
        backgroundColor: '#333333',
     },
    gameList: {
        backgroundColor:'#333333',
        marginTop:20,
        height: 40,
        justifyContent: 'center',

    },
    listTitle: {
        alignSelf:'center',
        color: 'white',
        fontSize: 30,
    },
    status: {
        marginTop:-60,
        left : 260,
    },
    statusIcon: {
        height:65,
        width:65,
        borderRadius: 93,
        borderWidth: 4,
        borderColor: "#333333",
        zIndex: 1,
    },
});

export default HomePage;